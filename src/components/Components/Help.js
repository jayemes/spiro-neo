import React from 'react'
import '../Style/Help.css'

class Help extends React.Component {

    render() {
        return (
            <div className="help-container" onClick={this.props.close}> 
                <h1>Spiro v0.1</h1>
                <p>This demo app was created by Juan Manuel Scasso</p>
                <h3>Usage tips</h3>
                <ul>
                    <li>Right click on the node area to add nodes</li>
                    <li>Right click on a node to delete or clone</li>
                    <li>Zoom, pan and rotate the 3D image with the mouse wheel and buttons</li>
                    <li>Zoom and pan the node editor in a similar way</li>
                    <li>In case of bad performance decrease the number of points and increment delta (if you want to cover more range)</li>
                    <li>Custom functions must use 't' as parameter, and you can input math.js compatible expressions</li>
                    <li>This is just a technical demo, it may contain catastrophic bugs</li>
                </ul>

                <h3>Libraries</h3>
                <ul>
                    <li>THREE.js</li>
                    <li>Rete.js</li>
                    <li>Material-UI</li>
                    <li>math.js</li>
                    <li>React.js</li>
                    <li>Firestore</li>
                </ul>
                <p>I'm looking for work as Full Stack or Android developer, if interested hit me up at jmscasso (gmail) </p>

            </div>
        )
    }


}

export default Help