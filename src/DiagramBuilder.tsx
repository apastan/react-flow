import {useCallback, useState} from 'react';
import '@xyflow/react/dist/style.css';
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    type Connection,
    Controls,
    type Edge,
    type EdgeChange, MarkerType,
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

type QuestionNodeData = {
    isStartNode: boolean
    questionDefault: string
    responseTextDefault: string
    onlyChoicesDefault: boolean
    removeNode: (id: string) => void
    updateStartNodeId: (id: string) => void
}

type ChoiceNodeData = {
    choiceTextDefault: string
    responseTextDefault: string
    requestContactDefault: boolean
    removeNode: (id: string) => void
}

export type QuestionNode = Node<QuestionNodeData, 'question'>;
export type ChoiceNode = Node<ChoiceNodeData, 'choice'>;

type AppNodes = Node<QuestionNodeData | ChoiceNodeData>[]

export function DiagramBuilder() {
    const [nodes, setNodes] = useState<AppNodes>([]);
    console.log("Render DiagramBuilder", nodes)
    const [edges, setEdges] = useState<Edge[]>([]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodes) => applyNodeChanges(changes, nodes)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edges) => applyEdgeChanges(changes, edges)),
        []
    );

    const onConnect = useCallback((connection: Connection) => {
        const source = connection.source;
        const target = connection.target;

        if (!source || !target || source === target) return;

        const sourceNode = nodes.find((node) => node.id === source);
        const targetNode = nodes.find((node) => node.id === target);

        if (!sourceNode || !targetNode) return;

        if (sourceNode.type === 'choice' && targetNode.type === 'choice') {
            alert('Нельзя соединить Choice с Choice');
            return;
        }

        // нельзя соединять вопрос → вопрос, если уже есть вопрос → ответ
        if (
            sourceNode.type === 'question' &&
            targetNode.type === 'question'
        ) {
            const hasChoiceConnection = edges.some(
                (e) =>
                    e.source === source &&
                    nodes.find((n) => n.id === e.target)?.type === 'choice'
            );
            if (hasChoiceConnection) {
                alert('Нельзя соединить вопрос с другим вопросом, если уже есть связь с ответом');
                return;
            }
        }

        setEdges((edges) => addEdge({
            ...connection,
            markerEnd: {
                type: MarkerType.ArrowClosed,
            },
        }, edges));
    }, [nodes, edges]);

    const updateStartNodeId = (id: string) => {

        // if (id === startNodeRef.current) return

        setNodes(nodes => nodes.map(node => {
            if (node.type === 'question' && 'isStartNode' in node.data) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        isStartNode: node.id === id,
                    },
                };
            }

            return node;
        }));
    };

    const removeNode = (id: string) => {
        setNodes((nodes) => nodes.filter(node => node.id !== id));

    }

    const addQuestionNode = () => {
        const newId = getId();

        // if (startNodeId === null) {
        //     setStartNodeId(newId)
        // }

        setNodes((nodes) => {
            const f =  nodes.some(node => node.type === 'question');

            const newQuestionNode: Node<QuestionNodeData> = {
                id: newId,
                type: 'question',
                position: { x: 100, y: 100 },
                data: {
                    isStartNode: !f,
                    updateStartNodeId,
                    questionDefault: "",
                    responseTextDefault: "fffffffffffff",
                    onlyChoicesDefault: true,
                    removeNode: removeNode
                },
            }

            // startNodeRef.current = newId

            return [
                ...nodes,
                newQuestionNode,
            ]
        });
    };

    const addChoiceNode = () => {
        const newId = getId();
        const newChoiceNode: Node<ChoiceNodeData> = {
            id: newId,
            type: 'choice',
            position: { x: 100, y: 100 },
            data: {
                choiceTextDefault: "",
                responseTextDefault: "ggggggggggg",
                requestContactDefault: false,
                removeNode: removeNode,
            },
        }

        setNodes((nodes) => [
            ...nodes,
            newChoiceNode,
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
