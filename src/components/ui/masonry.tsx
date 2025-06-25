import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTransition, a } from "@react-spring/web";
import { cn } from "@/lib/utils";

interface MasonryItem {
  id: string | number;
  height: number;
  data: any; // Generic data that will be passed to renderItem
}

interface GridItem extends MasonryItem {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MasonryProps {
  data: MasonryItem[];
  renderItem: (item: any) => React.ReactNode;
  className?: string;
}

function Masonry({ data, renderItem, className }: MasonryProps) {
  const [columns, setColumns] = useState<number>(2);

  useEffect(() => {
    const updateColumns = () => {
      if (window.matchMedia("(min-width: 1500px)").matches) {
        setColumns(5);
      } else if (window.matchMedia("(min-width: 1200px)").matches) {
        setColumns(4);
      } else if (window.matchMedia("(min-width: 768px)").matches) {
        setColumns(3);
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setContainerWidth(ref.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [columnHeights, gridItems] = useMemo<[number[], GridItem[]]>(() => {
    const currentColumnHeights = new Array(columns).fill(0);
    const calculatedGridItems: GridItem[] = [];

    data.forEach((item) => {
      const targetColumnIndex = currentColumnHeights.indexOf(
        Math.min(...currentColumnHeights)
      );

      const itemCalculatedWidth = containerWidth / columns;
      const itemCalculatedHeight = item.height;

      const x = itemCalculatedWidth * targetColumnIndex;
      const y = currentColumnHeights[targetColumnIndex];

      currentColumnHeights[targetColumnIndex] += itemCalculatedHeight;

      calculatedGridItems.push({
        ...item,
        x,
        y,
        width: itemCalculatedWidth,
        height: itemCalculatedHeight,
      });
    });

    return [currentColumnHeights, calculatedGridItems];
  }, [columns, data, containerWidth]);

  const transitions = useTransition<
    GridItem,
    { x: number; y: number; width: number; height: number; opacity: number }
  >(gridItems, {
    keys: (item) => item.id,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      style={{ height: Math.max(...columnHeights) || 0 }}
    >
      {transitions((style, item) => (
        <a.div
          key={item.id}
          style={style}
          className="absolute p-3 [will-change:transform,width,height,opacity]"
        >
          {renderItem(item.data)}
        </a.div>
      ))}
    </div>
  );
}

export { Masonry };