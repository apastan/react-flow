import {useCallback} from 'react';
import '@xyflow/react/dist/style.css';
import {
    addEdge,
    Background,
    type Connection,
    ConnectionLineType,
    Controls,
    type Edge,
    MiniMap,
    type Node,
    Panel,
    Position,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    type XYPosition,
} from '@xyflow/react';

import {Button} from '@/components/ui/button';
import {Plus} from 'lucide-react';
import {QuestionNode} from './QuestionNode';
import {ChoiceNode} from './ChoiceNode';
import {nanoid} from 'nanoid'
import dagre from '@dagrejs/dagre';


const nodeTypes = {
    question: QuestionNode,
    choice: ChoiceNode,
};

const getId = () => `${nanoid(3)}`;

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 300;
const nodeHeight = 230;

const getLayoutedElements = (nodes: AppNodes, edges: Edge[], direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes: AppNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        const positions: {targetPosition: Position, sourcePosition: Position, position: XYPosition} = {
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        }

        const newNode = {
            ...node,
            ...positions
        };

        return newNode;
    }) as AppNodes;

    return { nodes: newNodes, edges };
};

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

export type QuestionNodeType = Node<QuestionNodeData, 'question'>;
export type ChoiceNodeType = Node<ChoiceNodeData, 'choice'>;

type AppNodes = Node<QuestionNodeData | ChoiceNodeData>[]

export function DiagramBuilder() {
    const initialNodes: AppNodes = []
    const initialEdges: Edge[] = []

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    console.log("Render DiagramBuilder, nodes:", nodes)
    console.log("Render DiagramBuilder, edges:", edges)


    const onConnect = useCallback((connection: Connection) => {
        const source = connection.source;
        const target = connection.target;

        if (!source || !target || source === target) return;

        const sourceNode = nodes.find((node) => node.id === source);
        const targetNode = nodes.find((node) => node.id === target);

        if (!sourceNode || !targetNode) return;

        // Нельзя соединять ответ → ответ
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

        // нельзя соединять вопрос → ответ, если уже есть вопрос → вопрос
        if (
            sourceNode.type === 'question' &&
            targetNode.type === 'choice'
        ) {
            const hasQuestionConnection = edges.some(
                (e) =>
                    e.source === source &&
                    nodes.find((n) => n.id === e.target)?.type === 'question'
            );
            if (hasQuestionConnection) {
                alert('Нельзя соединить вопрос с ответом, если уже есть связь с другим вопросом');
                return;
            }
        }

        setEdges((edges) => addEdge({
            ...connection,
            // markerEnd: {
            //     type: MarkerType.ArrowClosed,
            // },
        }, edges));
    }, [nodes, edges]);

    const updateStartNodeId = (id: string) => {
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
        setNodes((nodes) => {
            const startNode = nodes.find((node) => node.id === id && node.type === 'question');
            // TODO - refactor - get rid of assertion
            if ((startNode as QuestionNodeType | undefined)?.data?.isStartNode) {
                alert('Вы удаляете стартовый вопрос - обязательно выберите другой вопрос в качестве стартового')
            }
            // TODO - refactor - O(n)
            return nodes.filter(node => node.id !== id)
        });
    }

    const addQuestionNode = () => {
        const newId = getId();

        setNodes((nodes) => {
            const hasQuestionNode = nodes.some(node => node.type === 'question');

            const newQuestionNode: Node<QuestionNodeData> = {
                id: newId,
                type: 'question',
                position: { x: 100, y: 100 },
                data: {
                    isStartNode: !hasQuestionNode,
                    updateStartNodeId,
                    questionDefault: "",
                    responseTextDefault: "",
                    onlyChoicesDefault: true,
                    removeNode: removeNode
                },
            }

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
                responseTextDefault: "",
                requestContactDefault: false,
                removeNode: removeNode,
            },
        }

        setNodes((nodes) => [
            ...nodes,
            newChoiceNode,
        ]);
    };

    const onLayout = useCallback(
        (direction: string) => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                nodes,
                edges,
                direction,
            );

            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
        },
        [nodes, edges],
    );

    return (
        <div className="h-screen w-full flex flex-col">
            <div className="p-4 flex gap-2 bg-gray-100 border-b">
                <Button onClick={addQuestionNode} variant="default">
                    <Plus className="w-4 h-4" /> Добавить вопрос
                </Button>
                <Button onClick={addChoiceNode} variant="outline">
                    <Plus className="w-4 h-4" /> Добавить вариант ответа
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
                        connectionLineType={ConnectionLineType.SimpleBezier} // TODO
                        style={{ backgroundColor: '#F7F9FB' }}
                    >
                        <Panel position="top-right">
                            <Button variant={'outline'} onClick={() => onLayout('TB')}>
                                Вертикально
                            </Button>
                            <Button variant={'outline'}  onClick={() => onLayout('LR')}>
                                Горизонтально
                            </Button>
                        </Panel>
                        <MiniMap />
                        <Controls />
                        <Background gap={12} />
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </div>
    );
}
