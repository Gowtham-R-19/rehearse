import { RES } from '../data/resources.js';

// List of learning links. ids = keys of RES.
export default function ResourceList({ ids }) {
  return (
    <ul className="res">
      {ids.map(id => (
        <li key={id}>
          <a href={RES[id].u} target="_blank" rel="noopener noreferrer">{RES[id].n}</a>
          <br /><span className="hint">{RES[id].w}</span>
        </li>
      ))}
    </ul>
  );
}
