import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Network } from 'vis-network/standalone';

const MindMap = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  // Initialize the mind map network
  const initializeMindMap = () => {
    const data = { nodes, edges };
    const options = {
      nodes: {
        shape: 'box',
        font: {
          size: 14,
          multi: 'html',
        },
        margin: 12,
        color: {
          background: '#f3f4f6',
          border: '#1e40af',
          highlight: {
            background: '#c7d2fe',
            border: '#1e3a8a',
          },
        },
      },
      edges: {
        arrows: {
          to: { enabled: true, scaleFactor: 1.5 },
        },height: 3,
        width: 3,
        color: '#1e90ff',
        smooth: {
          type: 'cubicBezier',
          forceDirection: 'horizontal',
          roundness: 0.4,
        },
        font: {
          align: 'middle',
        },
      },
      layout: {
        improvedLayout: true,
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -3000,
          springLength: 180,
          springConstant: 0.04,
        },
      },
    };

    // Destroy existing network before creating a new one
    if (networkRef.current) {
      networkRef.current.destroy();
    }

    networkRef.current = new Network(containerRef.current, data, options);
  };

  useEffect(() => {
    if (nodes.length > 0 && edges.length > 0) {
      initializeMindMap(); // Re-render the network when data updates
    }
  }, [nodes, edges]);

  const handleCreateClick = async () => {
    if (!inputText.trim()) {
      alert('Please enter some text to generate the mind map.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/generate_mindmap', {
        text: inputText,
      });

      const { nodes: newNodes, edges: rawEdges } = response.data;

      // 🔧 Transform backend edge format: source/target → from/to
      const newEdges = rawEdges.map((edge) => ({
        from: edge.source,
        to: edge.target,
        arrows: edge.arrows || 'to',
        label: edge.label || '',
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (error) {
      console.error('Mind map generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4 text-center">
        Generate Your Mind Map 🧠
      </h2>

      <div className="flex mb-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your topic or idea"
          className="w-full p-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreateClick}
          className="px-5 py-2 bg-indigo-500 text-white rounded-r-md hover:bg-indigo-600 transition-colors"
        >
          Create
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="w-full h-[300px] flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{ height: '600px', border: '1px solid #ccc' }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default MindMap;
