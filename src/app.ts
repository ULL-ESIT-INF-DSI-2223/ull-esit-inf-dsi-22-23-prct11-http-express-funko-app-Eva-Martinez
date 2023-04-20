import express, { response } from 'express';
import { spawn } from 'child_process';

const app = express();

app.get('/execmd', (req, res) => {
  if (req.query.cmd === undefined) {
    res.status(400);
    return res.send();
  }

  let command;

  if (req.query.cmd !== undefined) {
    if (req.query.args !== ""){
      if (req.query.args !== undefined) {
        command = spawn(req.query.cmd?.toString(), [req.query.args?.toString()]);
      }
    } else {
      command = spawn(req.query.cmd?.toString());
    }
  }

  if (command?.stderr) {
    res.status(500);
    return res.send({
      error: command.stderr,
    });
  } else {
    res.status(200);
    return res.send({
      output: command?.stdout,
    });
  }
});

app.get('*', (req, res) => {
  res.status(404);
  return res.send();
});
  
app.listen(3000, () => {
  console.log('Server is up on port 3000');
});