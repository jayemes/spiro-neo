import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField";

export default function LoadDialog(props) {

    const [code, setCode] = useState(null);

    const handleLoad = function (){
        props.loadCB(code)
    }

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handler}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Load Node Configuration</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter your code to load a previously saved configuration:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Code"
                        type="text"
                        fullWidth
                        onChange={e => setCode(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handler} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLoad} color="primary">
                        Load
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}