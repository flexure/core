import { AbstractFlexite } from "@flexure/common";
import { FlexBuilder } from "./Builder";
import { Flexite } from "./Composite";
const Flex = new FlexBuilder<AbstractFlexite>(Flexite);

export default Flex;


// export { Flexite } from "./core/flexite";
