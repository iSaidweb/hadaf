import { Spinner } from "@material-tailwind/react";

function Wait() {
    return (
        <div className="flex items-center justify-center w-full h-[50vh]">
            <Spinner color="green" />
            <p>Kuting...</p>
        </div>
    );
}

export default Wait;