import { useSelector } from "react-redux"
import uz from "./uz";
import ru from "./ru";
import en from "./en";
import cy from "./cy";

function langs() {
    const lang = useSelector(e => e?.user);
    let current = lang === 'uz' ? uz : lang === 'ru' ? ru : lang === 'en' ? en : cy
    return current
}
const current = langs();
export default current