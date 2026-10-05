'use client';
import { useEffect,useRef,type ReactNode } from 'react';
import { X } from 'lucide-react';
export default function Modal({title,onClose,children,wide=false}:{title:string;onClose:()=>void;children:ReactNode;wide?:boolean}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const element=dialog.current!;const previous=document.body.style.overflow;document.body.style.overflow='hidden';element.showModal();return()=>{element.close();document.body.style.overflow=previous;};},[]);
 return <dialog ref={dialog} className={`gb-modal ${wide?'wide':''}`} aria-label={title} onCancel={onClose} onClick={event=>{if(event.target===event.currentTarget)onClose();}} data-lenis-prevent><div className="modal-content"><button className="modal-close" type="button" onClick={onClose} aria-label="Fermer la fenêtre"><X size={20}/></button>{children}</div></dialog>;
}
