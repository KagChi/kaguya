import Listener from "../structures/Listener";
export default class errorEvent extends Listener {
    public name = "error";
    public exec(error: any) {
        console.log(error)
    }
}
