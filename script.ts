import { writeFileSync } from 'fs';
fetch('https://raw.githubusercontent.com/facebook/react/main/scripts/error-codes/codes.json')
  .then(res => res.json())
  .then(data => console.log(data["441"]))
  .catch(console.error);
