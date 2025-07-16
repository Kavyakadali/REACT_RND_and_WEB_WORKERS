import React, { useState } from "react";
import { Rnd } from "react-rnd";

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number | string;
  height: number | string;
}

interface FieldType {
  type: string;
  label: string;
}

interface CanvasField {
  id: number;
  type: string;
  label: string;
  position: Position;
  size: Size;
}

// Props interfaces
interface DraggableFieldProps {
  type: string;
  label: string;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, fieldType: string) => void;
}

interface CanvasFieldProps {
  id: number;
  type: string;
  label: string;
  position: Position;
  size: Size;
  onUpdate: (id: number, updates: Partial<CanvasField>) => void;
  onDelete: (id: number) => void;
}

// Draggable Field Component for the sidebar
const DraggableField: React.FC<DraggableFieldProps> = ({
  type,
  label,
  onDragStart,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      className="bg-blue-100 border-2 border-blue-300 rounded-lg p-3 mb-3 cursor-move hover:bg-blue-200 transition-colors"
    >
      <div className="text-sm font-medium text-blue-800">{label}</div>
      <input
        type="text"
        placeholder={`Enter ${label.toLowerCase()}...`}
        className="w-full mt-2 p-2 border border-gray-300 rounded text-sm"
        readOnly
      />
    </div>
  );
};

// Canvas Field Component that can be moved and resized
const CanvasField: React.FC<CanvasFieldProps> = ({
  id,
  type,
  label,
  position,
  size,
  onUpdate,
  onDelete,
}) => {
  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={(e: any, d: any) => {
        onUpdate(id, { position: { x: d.x, y: d.y } });
      }}
      onResizeStop={(
        e: any,
        direction: any,
        ref: any,
        delta: any,
        position: Position
      ) => {
        onUpdate(id, {
          size: {
            width: ref.style.width,
            height: ref.style.height,
          },
          position,
        });
      }}
      minWidth={200}
      minHeight={80}
      bounds="parent"
      className="border-2 border-dashed border-gray-400 bg-white rounded-lg"
    >
      <div className="h-full p-3 relative">
        <button
          onClick={() => onDelete(id)}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
        >
          ×
        </button>
        <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
        <input
          type="text"
          placeholder={`Enter ${label.toLowerCase()}...`}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
    </Rnd>
  );
};

// Main Form Builder Component
const FormBuilder: React.FC = () => {
  const [canvasFields, setCanvasFields] = useState<CanvasField[]>([]);
  const [draggedFieldType, setDraggedFieldType] = useState<string | null>(null);

  const fieldTypes: FieldType[] = [
    { type: "firstName", label: "First Name" },
    { type: "lastName", label: "Last Name" },
  ];

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    fieldType: string
  ): void => {
    setDraggedFieldType(fieldType);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (!draggedFieldType) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const fieldTypeData = fieldTypes.find((f) => f.type === draggedFieldType);

    // Handle case where fieldTypeData might be undefined
    if (!fieldTypeData) return;

    const newField: CanvasField = {
      id: Date.now(),
      type: draggedFieldType,
      label: fieldTypeData.label,
      position: { x: x - 100, y: y - 40 },
      size: { width: 200, height: 80 },
    };

    setCanvasFields((prevFields) => [...prevFields, newField]);
    setDraggedFieldType(null);
  };

  const updateField = (id: number, updates: Partial<CanvasField>): void => {
    setCanvasFields((fields) =>
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const deleteField = (id: number): void => {
    setCanvasFields((fields) => fields.filter((field) => field.id !== id));
  };

  const clearCanvas = (): void => {
    setCanvasFields([]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with draggable fields */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Form Fields</h2>
        <div className="space-y-3">
          {fieldTypes.map((field) => (
            <DraggableField
              key={field.type}
              type={field.type}
              label={field.label}
              onDragStart={handleDragStart}
            />
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Actions</h3>
          <button
            onClick={clearCanvas}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
          >
            Clear Canvas
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Instructions:
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Drag fields from here to the canvas</li>
            <li>• Move and resize fields on canvas</li>
            <li>• Click × to delete a field</li>
          </ul>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Form Canvas</h1>
          <p className="text-gray-600">
            Drag fields from the sidebar to build your form
          </p>
        </div>

        <div
          className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg h-full min-h-96"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {canvasFields.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📋</div>
                <div>Drop form fields here to start building</div>
              </div>
            </div>
          )}

          {canvasFields.map((field) => (
            <CanvasField
              key={field.id}
              id={field.id}
              type={field.type}
              label={field.label}
              position={field.position}
              size={field.size}
              onUpdate={updateField}
              onDelete={deleteField}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
