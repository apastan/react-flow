import {useRef, useState} from 'react';
import {Handle, type NodeProps, Position} from "@xyflow/react";
import {Button} from "@/components/ui/button.tsx";
import {MoreVertical, MessageCircleReply, Crown, Trash} from "lucide-react";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type {QuestionNode} from "@/DiagramBuilder.tsx";

export function QuestionNode(props: NodeProps<QuestionNode>) {
    const {id, data} = props
    const {isStartNode, updateStartNodeId, questionDefault, responseTextDefault, onlyChoicesDefault, removeNode} = data
    console.log(`Render QuestionNode ${id}`)

    const [showResponse, setShowResponse] = useState<boolean>(!!responseTextDefault);

    const questionRef = useRef<HTMLTextAreaElement>(null)
    const onlyChoicesRef = useRef<HTMLButtonElement>(null)
    const questionResponseRef = useRef<HTMLTextAreaElement>(null)

    const handleChangeStartNode = () => {
        if (!isStartNode) {
            updateStartNodeId(id);
        }
    };

    const handleRemoveNode = () => removeNode(id)

    const handleToggleResponse = () => {
        setShowResponse((state) => {
            if (state) {

                // добавить логику по очистке responseTextRef
                // добавить логику по удалению responseText из ноды
            }
            return !state
        })
    }

    const handleStyles = {background: 'white', height: '10px', width: '10px', border: '2px solid #1a192b'};

    return (
        <div className="bg-[#f8f8f8] border border-gray-400 rounded-lg shadow-md p-2 w-72">
            <Handle type="target" position={Position.Top} style={handleStyles} />
            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">Вопрос</span>
                <div className="flex items-center gap-2">
                    {isStartNode &&
                        <Crown className="w-4 h-4"/>
                    }
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={handleToggleResponse}>
                                    <MessageCircleReply className="w-4 h-4" />
                                    {showResponse ? "Удалить" : "Добавить"}
                                    {" "}
                                    Response
                                   </DropdownMenuItem>
                                {!isStartNode && <DropdownMenuItem onClick={handleChangeStartNode}>
                                    <Crown className="w-4 h-4"/>
                                    Сделать стартовым
                                   </DropdownMenuItem>}
                                <DropdownMenuItem onClick={handleRemoveNode}>
                                    <Trash className="w-4 h-4" />
                                    Удалить вопрос
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="mb-2">
                <Textarea
                    defaultValue={questionDefault}
                    placeholder="Введите текст вопроса"
                    className="text-sm"
                    ref={questionRef}
                />
            </div>
            <div className="mb-2">
                {showResponse && <Textarea
                    defaultValue={responseTextDefault}
                    placeholder="Response (необязательно)"
                    className="text-sm"
                    ref={questionResponseRef}
                />}
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id={`only_choices_${id}`} defaultChecked={onlyChoicesDefault} ref={onlyChoicesRef}/>
                <label htmlFor={`only_choices_${id}`} className="text-sm">Только выбор из вариантов</label>
            </div>
            <Handle type="source" position={Position.Bottom}  style={handleStyles} />
        </div>
    );
}
