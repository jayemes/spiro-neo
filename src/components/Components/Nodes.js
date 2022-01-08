import React from "react";

import { createEditor } from "./Rete";
import Button from "@material-ui/core/Button";
import AlertDialog from "./AlertDialog";
import LoadDialog from "./LoadDialog";
import Snackbar from "@material-ui/core/Snackbar";
import AreaPlugin from "rete-area-plugin";
import {
  getFirestore,
  collection,
  getDoc,
  doc,
  addDoc,
} from "firebase/firestore";

class Nodes extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.saveNodes = this.saveNodes.bind(this);
    this.loadNodes = this.loadNodes.bind(this);
    this.clearNodes = this.clearNodes.bind(this);
    this.getPoints = this.getPoints.bind(this);
    this.handleLoadDialog = this.handleLoadDialog.bind(this);
    this.handleAlertDialog = this.handleAlertDialog.bind(this);
    this.handleSnackbar = this.handleSnackbar.bind(this);

    this.state = {
      alertDialogOpen: false,
      sketchCode: null,
      loadDialogOpen: false,
      codeToLoad: null,
      snackbarOpen: false,
    };
  }

  saveNodes() {
    const db = getFirestore(window.firestoreApp);

    this.editor.then(
      function (it) {
        const doc = it.toJSON();
        doc.isPreset = false;

        // console.log(doc)
        const _this = this;

        this.props.handleSpinner(true)();

        addDoc(collection(db, "user_presets"), doc)
          .then(function (docRef) {
            _this.setState({ sketchCode: docRef.id });
            window.history.replaceState(
              null,
              "Your Saved Sketch",
              "/" + docRef.id
            );
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
            _this.setState({ sketchCode: -1 });
          })
          .finally(function () {
            _this.handleAlertDialog();
            _this.props.handleSpinner(false)();
          });
      }.bind(this)
    );
  }

  clearNodes() {
    this.editor.then((editor) => {
      editor.clear();
      this.props.clearOutputs();
    });
  }

  loadNodes(code) {
    const db = getFirestore(window.firestoreApp);

    this.props.handleSpinner(true)();

    const docRef = doc(db, "user_presets", code);

    getDoc(docRef)
      .then((doc) => {
        if (doc.exists) {
          this.editor
            .then((editor) => {
              editor.fromJSON(doc.data()).then((_) => {
                window.history.replaceState(null, "Your Sketch", "/" + code);
                console.log("Success loading");
                this.props.clearOutputs();
                AreaPlugin.zoomAt(editor, editor.nodes);
              });
            })
            .catch((e) => console.log(e));
        } else {
          this.setState({ snackbarOpen: true });
        }
      })
      .finally(() => {
        this.setState({ loadDialogOpen: false });
        this.props.handleSpinner(false)();
      });
  }

  getPoints() {
    let points = window.points;
    let j = document.createElement("a");
    j.id = "download";
    j.download = "stack_" + Date.now() + ".json";
    j.href = URL.createObjectURL(new Blob([JSON.stringify(points, null, 2)]));
    j.click();
  }

  handleLoadDialog() {
    this.setState((prev) => ({ loadDialogOpen: !prev.loadDialogOpen }));
  }

  handleAlertDialog() {
    this.setState((prev) => ({ alertDialogOpen: !prev.alertDialogOpen }));
  }

  handleSnackbar(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackbarOpen: false });
  }

  componentDidUpdate(prevProps, _, __) {
    if (prevProps.code === this.props.code) {
      // console.log('No change in nodes')
    } else {
      console.log("Change in nodes, loading new preset...");
      this.loadNodes(this.props.code);

      // this.myRef.current.innerHTML = ""
    }
  }

  componentDidMount() {
    this.editor = createEditor(this.myRef.current, this.props.handleOutput);

    this.editor.then(() => {
      if (this.props.code) this.loadNodes(this.props.code);
    });
  }

  render() {
    return (
      <React.Fragment>
        <div id="nodes" ref={this.myRef}>
          <div id="stats" style={{ position: "absolute" }} />
          <Button
            style={{ margin: "5px" }}
            variant="contained"
            color="primary"
            onClick={this.saveNodes}
          >
            Save
          </Button>

          <Button
            style={{ margin: "5px" }}
            variant="contained"
            color="primary"
            onClick={this.handleLoadDialog}
          >
            Load
          </Button>

          <Button
            style={{ margin: "5px" }}
            variant="contained"
            color="secondary"
            onClick={this.clearNodes}
          >
            Clear
          </Button>

          <Button
            style={{ margin: "5px" }}
            variant="contained"
            color="primary"
            onClick={this.getPoints}
          >
            Get Points (json)
          </Button>
        </div>
        <AlertDialog
          open={this.state.alertDialogOpen}
          code={this.state.sketchCode}
          handler={this.handleAlertDialog}
        />

        <LoadDialog
          open={this.state.loadDialogOpen}
          handler={this.handleLoadDialog}
          loadCB={this.loadNodes}
        />

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={3000}
          onClose={this.handleSnackbar}
          message="The code entered doesn't correspond to a saved configuration"
        />
      </React.Fragment>
    );
  }
}

export default Nodes;
