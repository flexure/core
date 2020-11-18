import React from "react";
var _ = require("lodash");

export interface IContextCallback<T> {
	children: (value: T) => any;
}

class Singleton {
	private components: { [key: string]: React.ComponentType<any> | any } = {};
	private paths: Array<any> = [];
	public context: { [key: string]: any } = { paths: this.paths };

	private static instance: Singleton;

	public static getInstance(): Singleton {
		if (!Singleton.instance) {
			Singleton.instance = new Singleton();
		}

		return Singleton.instance;
	}

	public withContext<T extends object>(ctx: string) {
		const WithContext: React.FC<IContextCallback<T>> = (props) => {
			return props.children(this.context[ctx]);
		};
		return WithContext;
	}

	public Component: React.FC<{ name: string; injectProps?: { [key: string]: any } }> = (props) => {
		const TempComponent: any = this.components[props.name];
		if (!TempComponent) {
			return <div>Component Not Found</div>;
		} else {
			// const _props: any = _.merge(this.context, { ...props });

			if (TempComponent.defaultProps) {
				this.AssignObjectToObject(TempComponent.defaultProps, this.context);
			}

			return <TempComponent {...props} />;
		}
	};

	public register(component: React.ComponentType<any>): string {
		if (!component.displayName) throw new Error(`${typeof component}: displayName is blank`);

		const NewComponent = { [`${component.displayName}`]: component };
		_.assign(this.components, NewComponent);
		return component.displayName;
	}

	protected AssignObjectToObject(to: any, from: any): any {
		return _.assign(to, _.pick(from, _.keys(to)));
	}

	public registerContext(args: { [key: string]: any }) {
		_.assign(this.context, args);
	}

	public registerPath(args: { [key: string]: any }) {
		this.paths.push(args);
	}
}

export const Flexton = Singleton.getInstance();
export const FlexComponent = Flexton.Component;
