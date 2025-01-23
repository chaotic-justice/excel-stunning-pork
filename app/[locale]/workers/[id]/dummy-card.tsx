import { File, Folder, Tree } from "@/components/ui/file-tree"

export function FileTreeDemo() {
  return (
    // <div className="relative flex h-[300px] w-1/2 flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
    //   </div>
    <Tree className="overflow-hidden rounded-md bg-background p-2" initialSelectedId="2" initialExpandedItems={["1"]} elements={ELEMENTS}>
      <Folder element="documents" value="1">
        {ELEMENTS[0].children.map((ele, idx) => {
          return (
            <File key={idx} value={ele.id}>
              <p>{ele.name}</p>
            </File>
          )
        })}
      </Folder>
    </Tree>
  )
}

const ELEMENTS = [
  {
    id: "1",
    isSelectable: true,
    name: "documents",
    children: [
      {
        id: "2",
        isSelectable: true,
        name: "app",
      },
      {
        id: "3",
        isSelectable: true,
        name: "layout.tsx",
      },
      {
        id: "4",
        isSelectable: true,
        name: "page.tsx",
      },
      {
        id: "5",
        isSelectable: true,
        name: "components",
      },
    ],
  },
]
