import React, {useState} from 'react';
import {Handle, Position} from "@xyflow/react";
import {Button} from "@/components/ui/button.tsx";
import {Trash} from "lucide-react";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";

export  function ChoiceNode({ id }: any) {
    const [text, setText] = useState('');
    const [response, setResponse] = useState('');
    const [requestContact, setRequestContact] = useState(false);

    return (
        <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md p-2 w-72">
            <Handle type="target" position={Position.Top} />
            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">Вариант ответа</span>
                <Button size="icon" variant="ghost">
                    <Trash className="w-4 h-4" />
                </Button>
            </div>
            <div className="mb-2">
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Текст варианта"
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
                <Checkbox id={`request_contact_${id}`} checked={requestContact} onCheckedChange={(val) => setRequestContact(!!val)} />
                <label htmlFor={`request_contact_${id}`} className="text-sm">Запросить контакт</label>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}