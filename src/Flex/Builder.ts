import { FlexComposite } from "./Composite";
import { Flexton } from "./Singleton";
import { IFlexTree, IFlexNode, AbstractFlexite } from "@flexure/common";

interface IBuilder {
	init(args: IFlexTree): void;
}

export class FlexBuilder<T extends AbstractFlexite> implements IBuilder {
	private product: T;

	constructor(parent: T) {
		this.product = parent;
	}

	protected addApp(parent: AbstractFlexite, child: IFlexNode) {
		const _child = new FlexComposite();
		let component: any = child.component ? Flexton.register(child.component) : undefined;
		_child.props = { ...child, component };

		child.nodes?.forEach((node) => {
			// note: Register the path to Flexton
			node.path && Flexton.registerPath({ ...node, component: node.component?.displayName });

			this.addApp(_child, node);
		});

		parent.add(_child);
		Flexton.registerContext(parent.operation());
	}

	public init(tree: IFlexTree): T {
		this.product.props.name = tree.name;
		this.product.props.component = Flexton.register(tree.component);

		tree.nodes?.forEach((node) => {
			this.addApp(this.product, node);
		});
		Flexton.registerContext(this.product.operation());
		// console.log(this.product.operation())
		return this.product;
	}

	public getProduct(): T {
		const result = this.product;
		return result;
	}
}
