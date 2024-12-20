import { Node } from "../../node";
import { Process, Status } from "../../process";
import { Stack, TreeEnv } from "../../tree-env";

const EMPTY_STACK: Stack = new Stack(null!);

export class Parallel extends Process {
    constructor() {
        super({
            name: "Parallel",
            type: "Composite",
            status: ["success", "|running"],
            children: -1,
            desc: "并行执行",
            doc: `
                + 并行执行所有子节点
                + 当有子节点返回 \`running\` 时，返回 \`running\` 状态
                + 执行完所有子节点后，返回 \`success\``,
        });
    }

    override tick(node: Node, env: TreeEnv): Status {
        const last: Stack[] = node.resume(env) ?? [];
        const level = env.stack.length;
        let count = 0;

        node.children.forEach((child, idx) => {
            let stack = last[idx];
            let status: Status | undefined;
            if (stack === undefined) {
                status = child.tick(env);
            } else if (stack.length > 0) {
                stack.move(env.stack, 0, stack.length);
                while (env.stack.length > level) {
                    child = env.stack.top()!;
                    status = child.tick(env);
                    if (status === "running") {
                        break;
                    }
                }
            } else {
                status = "success";
            }

            if (status === "running") {
                if (stack === undefined) {
                    stack = new Stack(env);
                }
                env.stack.move(stack, level, env.stack.length - level);
            } else {
                count++;
                stack = EMPTY_STACK;
            }

            last[idx] = stack;
        });

        if (count === node.children.length) {
            return "success";
        } else {
            return node.yield(env, last);
        }
    }
}
