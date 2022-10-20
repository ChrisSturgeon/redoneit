import MobileBackdrop from '../MobileBackdrop/MobileBackdrop';
import './MobileNav.css';

export default function MobileNav({ handleClose }) {
  return (
    <MobileBackdrop onClick={handleClose}>
      <div>Hi</div>
    </MobileBackdrop>
  );
}
