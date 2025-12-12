import { CSSProperties, type ReactNode } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortablePlayerRow({
  field,
  index,
  renderField,
}: {
  field: any;
  index: number;
  renderField: (field: any, index: number) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "8px",
    background: "#fff",
    border: "1px solid #ccc",
    padding: "8px",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...listeners}
          className="cursor-grab select-none rounded border border-gray-300 bg-gray-50 px-2 py-1 text-sm text-gray-700 active:cursor-grabbing"
          title="Drag to reorder"
          aria-label="Drag to reorder"
        >
          ≡
        </button>

        <div className="flex-1">{renderField(field, index)}</div>
      </div>
    </div>
  );
}

export default SortablePlayerRow;
