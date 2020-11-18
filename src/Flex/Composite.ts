import { IFlexiteProps, AbstractFlexite } from "@flexure/common";

var _ = require("lodash");

export class FlexComposite extends AbstractFlexite {
	props: IFlexiteProps = {};
	protected children: AbstractFlexite[] = [];

	public add(component: AbstractFlexite): void {
		this.children.push(component);
		component.setParent(this);
	}

	public remove(component: AbstractFlexite): void {
		const componentIndex = this.children.indexOf(component);
		this.children.splice(componentIndex, 1);

		component.setParent(null);
	}

	public isComposite(): boolean {
		return true;
	}

	public operation(): { [key: string]: any } {
		const results: any = this.children.length > 0 ? {} : undefined;
		this.children.forEach((child) => {
			_.assign(results, child.operation());
		});

		return { [`${this.props.name}`]: { ...this.props, nodes: results } };
	}
}

export const Flexite = new FlexComposite();
