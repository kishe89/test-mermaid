const fs = require('fs');
const { exec } = require('child_process');

const mermaidCode = `
gantt
  dateFormat  YYYY-MM-DD
  title Your Gantt Chart

  section Section 1
  Task 1: done, 2023-06-01, 2023-06-03
  Task 2: done, 2023-06-04, 2023-06-06
  Task 3: done, 2023-06-07, 2023-06-10

  section Section 2
  Task 4: 2023-06-05, 2023-06-08
  Task 5: 2023-06-09, 2023-06-12
`;

fs.writeFileSync('gantt.md', mermaidCode);

exec('mmdc -i gantt.md -o gantt.svg', (error) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Gantt chart generated successfully!');
    }
});
