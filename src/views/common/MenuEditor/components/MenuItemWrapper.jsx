import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import cn from "classnames";

const MenuItemWrapper = ({
  index,
  itemId,
  moveCard,
  children,
  isChildItem,
  className,
  dragClassName,
  style
}) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "card",
    hover(item, monitor) {
      const draggedItem = item;
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Если двигаем родителя и он попадает на дочерние элементы происходит копирование элементов
      // Для этого сравниваем что, если ховер элемент дочерний, делаем остановку выполнения
      if (isChildItem !== draggedItem.isChildItem) {
        return;
      }
      // Time to actually perform the action
      moveCard(itemId, draggedItem.itemId);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      draggedItem.index = hoverIndex;
    }
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: "card", index, itemId, isChildItem },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const zIndex = isDragging ? 2 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cn(isDragging ? dragClassName : "", className)}
      style={{ zIndex, ...style }}
    >
      {children}
    </div>
  );
};
export default MenuItemWrapper;
