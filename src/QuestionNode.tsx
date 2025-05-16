import React, {useCallback, useState} from 'react';
import {Handle, Position} from "@xyflow/react";
import {Button} from "@/components/ui/button.tsx";
import {MoreVertical, Star} from "lucide-react";
import {Toggle} from "@/components/ui/toggle.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";

export function QuestionNode({ id, data }: any) {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [onlyChoices, setOnlyChoices] = useState(false);

    const isActive = data.startNodeId === id;
    const toggleStart = () => {
        if (!isActive) {
            data.setStartNodeId(id);
        }
    };

    return (
        <div className="bg-green-100 border border-green-300 rounded-lg shadow-md p-2 w-72">
            <Handle type="target" position={Position.Top} />
            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">Вопрос</span>
                <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                    <Toggle pressed={isActive} onPressedChange={toggleStart} disabled={isActive}>
                        <Star className="w-4 h-4" />
                    </Toggle>
                </div>
            </div>
            <div className="mb-2">
                <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Текст вопроса"
                    className="text-sm"
                />
            </div>
            <div className="mb-2">
                <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Response (необязательно)"
                    className="text-sm"
                />
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id={`only_choices_${id}`} checked={onlyChoices} onCheckedChange={(val) => setOnlyChoices(!!val)} />
                <label htmlFor={`only_choices_${id}`} className="text-sm">Только выбор из вариантов</label>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}