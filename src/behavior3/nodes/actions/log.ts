import { Node } from "../../node";
import { Process, Status } from "../../process";
import { TreeEnv } from "../../tree-env";

interface NodeArgs {
    readonly message: string;
    readonly level: LogLevel;
}

enum LogLevel {
    INFO = "info",
    DEBUG = "debug",
    WARN = "warn",
    ERROR = "error",
}

type NodeInput = [unknown?];

export class Log extends Process {
    constructor() {
        super({
            name: "Log",
            type: "Action",
            children: 0,
            status: ["success"],
            desc: "打印日志",
            input: ["日志?"],
            args: [
                {
                    name: "message",
                    type: "string",
                    desc: "日志",
                },
                {
                    name: "level",
                    type: "enum",
                    desc: "日志级别",
                    default: LogLevel.INFO,
                    options: [
                        {
                            name: "INFO",
                            value: LogLevel.INFO,
                        },
                        {
                            name: "DEBUG",
                            value: LogLevel.DEBUG,
                        },
                        {
                            name: "WARN",
                            value: LogLevel.WARN,
                        },
                        {
                            name: "ERROR",
                            value: LogLevel.ERROR,
                        },
                    ],
                },
            ],
        });
    }

    override tick(node: Node, env: TreeEnv): Status {
        const [inputMsg] = env.input as NodeInput;
        const args = node.args as unknown as NodeArgs;
        const level = args.level ?? LogLevel.INFO;
        let print = console.log;
        if (level === LogLevel.INFO) {
            print = console.info;
        } else if (level === LogLevel.DEBUG) {
            print = console.debug;
        } else if (level === LogLevel.WARN) {
            print = console.warn;
        } else if (level === LogLevel.ERROR) {
            print = console.error;
        }
        print.call(console, "behavior3 -> log:", args.message, inputMsg ?? "");
        return "success";
    }
}
