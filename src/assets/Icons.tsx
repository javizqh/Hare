import { TreeItemState } from "@hare-ide/hare";
import { SVGProps } from "react"

export default function substituteDefault (value:string, state: TreeItemState) {

  //TODO: search by value ony for default icons, if nor by ctx and if regex with name
  let substitute = value.slice(2, -1)

  switch (substitute) {
    case "file":
      return File;
    default:
      break;
  }

  return Default
}


const File = (props: SVGProps<SVGSVGElement>) => (
  <svg id='icon' className="inside-button icon" aria-hidden="true" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M10 3v4a1 1 0 0 1-1 1H5m5 4-2 2 2 2m4-4 2 2-2 2m5-12v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"/>
  </svg>
);

const Default = (props: SVGProps<SVGSVGElement>) => (
  <svg id='icon' className="inside-button icon" aria-hidden="true" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M10 3v4a1 1 0 0 1-1 1H5m5 4-2 2 2 2m4-4 2 2-2 2m5-12v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"/>
  </svg>
);