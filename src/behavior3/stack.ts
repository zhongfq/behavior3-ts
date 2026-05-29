import type { Context } from "./context";
import type { Node } from "./node";
import { Tree } from "./tree";

export class StackSlice {
    protected _nodes: Node[] = [];

    get length() {
        return this._nodes.length;
    }

    move(dest: StackSlice, start: number) {
        const count = this._nodes.length - start;
        dest._nodes.push(...this._nodes.splice(start, count));
    }

    clear() {
        this._nodes.length = 0;
    }
}

export class Stack extends StackSlice {
    private _tree: Tree<Context, unknown>;

    constructor(tree: Tree<Context, unknown>) {
        super();
        this._tree = tree;
    }

    top(): Node | undefined {
        const nodes = this._nodes;
        return nodes[nodes.length - 1];
    }

    push(node: Node) {
        this._nodes.push(node);
    }

    pop(): Node | undefined {
        const node = this._nodes.pop();
        if (node) {
            this._tree.blackboard.set(node.__yield, undefined);
        }
        return node;
    }

    popTo(index: number) {
        while (this._nodes.length > index) {
            this.pop();
        }
    }

    override clear() {
        this.popTo(0);
    }
}
