import express from "express";
import bodyParser from "body-parser";
import { Block, generateNextBlock, getBlockchain } from './blockchain';

const initHttpServer = (port: number) => {
    const app = express();
    app.use(bodyParser.json());

    app.get("/", (req, res) => {
        res.send("Hello, World!");
    });
    app.get("/blocks", (req, res) => {
        res.send(getBlockchain());
    });
    app.post("/mineBlock", (req, res) => {
        const newBlock: Block = generateNextBlock(req.body.data);
        res.send(newBlock);
    });
    app.get("/peers", (req, res) => {
        res.send(getSockets().map((s:any) => s._socket.remoteAddress + ":" + s._socket.remotePort));
    });
    app.post("/addPeer", (req, res) => {
        connectToPeers(req.body.peer);
        res.send();
    });

    app.listen(port, () => {
        console.info("Listening http on port: " + port);
    });
}

initHttpServer(3001);

// FIXME
const getSockets = () => [];

// FIXME
const connectToPeers = (peer: any) => {};