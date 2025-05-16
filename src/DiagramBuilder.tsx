import React, {useCallback, useState} from 'react';
import '@xyflow/react/dist/style.css';
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    type Connection,
    Controls,
    type Edge,
    type EdgeChange,
    MarkerType,
    MiniMap,
    type Node,
    type NodeChange,
    ReactFlow,
    ReactFlowProvider,
} from '@xyflow/react';

import {Button} from '@/components/ui/button';
import {Plus} from 'lucide-react';

import {QuestionNode} from './QuestionNode';
import {ChoiceNode} from './ChoiceNode';

const nodeTypes = {
    question: QuestionNode,
    choice: ChoiceNode,
};

let id = 0;
const getId = () => `node_${id++}`;

export function DiagramBuilder() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [startNodeId, setStartNodeId] = useState<string | null>(null);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (connection: Connection) => {
            const sourceNode = nodes.find((n) => n.id === connection.source);
            const targetNode = nodes.find((n) => n.id === connection.target);

            if (!sourceNode || !targetNode) return;
            if (sourceNode.type === 'choice' && targetNode.type === 'choice') {
                alert('Нельзя соединить Choice с Choice');
                return;
            }

            setEdges((eds) =>
                addEdge(
                    {
                        ...connection,
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                        },
                    },
                    eds
                )
            );
        },
        [nodes]
    );

    const addQuestionNode = () => {
        const newId = getId();
        setNodes((nds) => [
            ...nds,
            {
                id: newId,
                type: 'question',
                position: { x: 100, y: 100 },
                data: {
                    isStart: startNodeId === null,
                    setStartNodeId,
                    startNodeId,
                },
            },
        ]);
        if (startNodeId === null) setStartNodeId(newId);
    };

    const addChoiceNode = () => {
        const newId = getId();
        setNodes((nds) => [
            ...nds,
            {
                id: newId,
                type: 'choice',
                position: { x: 300, y: 100 },
                data: {},
            },
        ]);
    };

    return (
        <div className="h-screen w-full flex flex-col">
            <div className="p-4 flex gap-2 bg-gray-100 border-b">
                <Button onClick={addQuestionNode} variant="default">
                    <Plus className="w-4 h-4 mr-2" /> Добавить вопрос
                </Button>
                <Button onClick={addChoiceNode} variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Добавить вариант ответа
                </Button>
            </div>
            <div className="flex-1">
                <ReactFlowProvider>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <MiniMap />
                        <Controls />
                        <Background gap={12} />
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </div>
    );
}
