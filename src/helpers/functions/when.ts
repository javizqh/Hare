export interface Context {
  [Key: string]: string;
}
  
export default function when(check: string, context:Context): boolean {
  if (check.length === 0) {
    return true;
  }

  let part = check.split(" ");
  let result = true;

  let a: string | undefined = undefined;
  let b: string | undefined = undefined;
  let op: string | undefined = undefined;
  let concat: boolean = true;
  let substitution: string | undefined = undefined;

  part.forEach(element => {
    if (element === "&&") {
      concat = true;
      return;
    } else if (element === "||") {
      concat = false;
      return;
    }

    if (!a) {
      substitution = context[element];
      if (substitution) {
        a = substitution
      } else {
        a = element;
      }
      return;
    }

    if (!op) {
      op = element;
      return;
    }

    if (!b) {
      substitution = context[element];
      if (substitution) {
        b = substitution
      } else {
        b = element;
      }
      //TODO: here execute
      let tmp = doOperation(a,b,op);
      if (concat) {
        result = result && tmp;
      } else {
        result = result || tmp;
      }
      a = undefined;
      b = undefined;
      op = undefined;
      return;
    }
  });

  return result;
}

function doOperation(a: string, b:string, op:string): boolean {
  switch (op) {
    case "==":
      return a === b;
    case "!=":
      return a !== b;
    default:
      break;
  }
  
  return false;
}