import React from 'react';
import '../../css/App.css';
import Nodes from './Nodes'
import ThreeDElement from './ThreeDElement'
import Help from './Help'
import Drawer from './Drawer'

import {ThemeProvider} from '@material-ui/core/styles';
import {Button} from '@material-ui/core'
import Spinner from "./Spinner";
import {presets} from "../../presets";
import theme from "../../MUI_theme";

class App extends React.Component {
  constructor(props) {
    super(props)

    window.outputs = {}

    const code = this.props['*'] || presets[0].code
    // const code = null

    this.state = {
      output: null,
      style: null,
      showHelp: false,
      code: code,
      showSpinner: false,
      outputs: {},
    }

    this.handleOutput = this.handleOutput.bind(this)
    this.toggleHelp = this.toggleHelp.bind(this)
    this.handlePreset = this.handlePreset.bind(this)
    this.handleSpinner = this.handleSpinner.bind(this)
    this.clearOutputs = this.clearOutputs.bind(this)

    this.drawerData = {
      presets,
      handler: this.handlePreset
    }

  }

  handleSpinner(show) {
    return (() => this.setState({showSpinner: show}))
  }

  handlePreset(data) {
    this.setState({code: data.code})
  }

  toggleHelp() {
    this.setState(prev => ({showHelp: !prev.showHelp}))
  }

  handleOutput(vector, style, delta, nops, initial, transform, id, mode = 'write') {

    this.setState(previous => {
      if (mode === 'delete') {
        const res = {...previous.outputs}
        delete res[id]

        return {outputs: res}
      }

      return {
        outputs: {
          ...previous.outputs,
          [id]: {output: vector, style, delta, nops, initial, transform}
        }
      }
    })

  }

  clearOutputs() {
    this.setState({outputs: {}})
  }

  render() {

    return (
      <ThemeProvider theme={theme} >
        <div className="App" style={{height: "100vh"}}>

          <div className="main">
            <ThreeDElement
              outputs={this.state.outputs}
              handlePoints={this.handlePoints}/>

            <div id="nodes-container">
              <Nodes handleOutput={this.handleOutput}
                     handleSpinner={this.handleSpinner}
                     clearOutputs={this.clearOutputs}
                     code={this.state.code}
              />
            </div>

          </div>

          <div className="fixed-elems">

            <Button variant="contained" color="secondary"
                    onClick={this.toggleHelp}> Help
              <div className="help-icon">
                {/*<img src={} alt=""/>*/}?
              </div>
            </Button>
            <br/>
            <Drawer data={this.drawerData}/>

          </div>
          {this.state.showHelp ? <Help close={this.toggleHelp}/> : null}

          {this.state.showSpinner ? <Spinner/> : null}
        </div>
      </ ThemeProvider>
    )
  }
}

export default App;
