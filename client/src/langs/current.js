import { useSelector } from "react-redux";

export default function lang() {
    const { current } = useSelector(e => e?.lang);
    return current;
}