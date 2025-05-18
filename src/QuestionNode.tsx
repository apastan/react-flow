import {useRef, useState} from 'react';
import {Handle, type NodeProps, Position, useEdges, useNodes} from "@xyflow/react";
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

const handleStyles = {background: 'white', height: '10px', width: '10px', border: '2px solid #1a192b'};

export function QuestionNode(props: NodeProps<QuestionNode>) {
    const {id, data} = props
    const {isStartNode, updateStartNodeId, questionDefault, responseTextDefault, onlyChoicesDefault, removeNode} = data
    console.log(`Render QuestionNode ${id}`)

    const [showResponse, setShowResponse] = useState<boolean>(!!responseTextDefault);

    const questionElementRef = useRef<HTMLTextAreaElement>(null)
    const responseInitialValue = useRef(responseTextDefault)
    const responseElementRef = useRef<HTMLTextAreaElement>(null)
    const onlyChoicesInitialValue = useRef(onlyChoicesDefault)
    const onlyChoicesElementRef = useRef<HTMLButtonElement>(null)

    const nodes = useNodes()
    const edges = useEdges()
    const connections = edges.filter(edge => edge.source === id)
    const hasConnectionWithChoiceNode = connections.some(edge => nodes.find(node => node.id === edge.target)?.type === 'choice')

    if (!hasConnectionWithChoiceNode) {
        onlyChoicesInitialValue.current = false
    }

    const handleToggleResponse = () => {
        setShowResponse((state) => {
            if (state) {
                if (responseElementRef.current) {
                    responseElementRef.current.value = ""
                }
                responseInitialValue.current = ""
            }
            return !state
        })
    }

    return (
        <div className="bg-[#f8f8f8] border border-gray-400 rounded-lg shadow-md p-2 w-72">
            <Handle type="target" position={Position.Top} style={handleStyles} />
            <div className="flex justify-between items-center mb-2">
                <div className={'flex'}>
                    <span className="font-semibold text-sm mr-1">
                        {isStartNode ? 'Стартовый вопрос' : 'Вопрос'}
                    </span>
                    <span className={'flex justify-center items-center'}>
                        {isStartNode &&
                            <Crown className="w-4 h-4 text-amber-600"/>
                        }
                    </span>
                </div>
                <div className="flex items-center gap-2">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
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
                                {!isStartNode && <DropdownMenuItem onClick={() => updateStartNodeId(id)}>
                                    <Crown className="w-4 h-4"/>
                                    Сделать стартовым
                                   </DropdownMenuItem>}
                                <DropdownMenuItem onClick={() => removeNode(id)}>
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
                    className="text-sm px-1 py-0"
                    ref={questionElementRef}
                />
            </div>
            <div className="mb-2">
                {showResponse && <Textarea
                    defaultValue={responseInitialValue.current}
                    placeholder="Response (необязательно)"
                    className="text-sm px-1 py-0"
                    ref={responseElementRef}
                />}
            </div>
            {hasConnectionWithChoiceNode && <div className="flex items-center gap-2">
                <Checkbox id={`only_choices_${id}`} defaultChecked={onlyChoicesInitialValue.current} ref={onlyChoicesElementRef}/>
                <label htmlFor={`only_choices_${id}`} className="text-sm">Только выбор из вариантов</label>
            </div>}
            <Handle type="source" position={Position.Bottom}  style={handleStyles} />
        </div>
    );
}
