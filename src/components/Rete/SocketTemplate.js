import React from 'react';
import '../../css/Socket.css'

function  kebab(str) {
    const replace = s => s.toLowerCase().replace(/ /g, '-');
    return Array.isArray(str) ? str.map(replace) : replace(str);
}


export default class SocketTemplate extends React.Component {
    createRef = el => {
        const { innerRef, type, io } = this.props;

        el && innerRef(el, type, io);
    };

    render () {
        const { socket, type } = this.props;

        return (
            <div
                className={`socket ${type} ${kebab(socket.name)}`}
                title={socket.name}
                ref={el => this.createRef(el)} // force update for new IO with a same key
            />
        )
    }
}