import { TreeEnv } from "./tree-env";

import { ObjectType } from "./context";
import { Node, NodeDef } from "./node";

export type Status = "success" | "failure" | "running";

export abstract class Process {
    init?(node: Node): Readonly<ObjectType> | void;

    protected _checkOneof<V>(
        node: Node,
        env: TreeEnv,
        inputIndex: number,
        argValue: V | undefined,
        defaultValue?: V
    ) {
        const inputValue = env.input[inputIndex];
        const inputName = node.input[inputIndex];
        let value: V | undefined;
        if (inputName) {
            if (inputValue === undefined) {
                const func = defaultValue === undefined ? node.error : node.warn;
                func.call(node, `${node.tree.name}#${node.id}: missing input '${inputName}'`);
            }
            value = inputValue as V;
        } else {
            value = argValue;
        }
        return (value ?? defaultValue) as V;
    }

    abstract run(node: Node, env: TreeEnv): Status;

    abstract get descriptor(): NodeDef;
}
