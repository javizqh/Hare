export function subscribe(eventName:string, listener: () => void) {
  document.addEventListener(eventName, listener);
}

export function unsubscribe(eventName:string, listener: () => void) {
  document.removeEventListener(eventName, listener);
}

// export function publish(eventName:string, data:string) {
//   const event = new CustomEvent(eventName, { detail: data });
//   document.dispatchEvent(event);
// }

export function publish(eventName:string) {
  const event = new CustomEvent(eventName);
  document.dispatchEvent(event);
  console.log("publish", "Inside")
}