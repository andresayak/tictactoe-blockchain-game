import React from "react";

type LinkItem = {
  href: string;
  label: string;
}
let items: LinkItem[] = [
  {
    href: '/api/',
    label: 'API',
  },
  {
    href: '/terms',
    label: 'Terms',
  },
];

if(process.env.TESTNET_APP_ORIGIN){
  items.push({
    href: process.env.TESTNET_APP_ORIGIN,
    label: 'Testnets',
  });
}

const RenderLinks = ({children}: {children: (item:LinkItem)=>React.ReactElement}) => {
  return items.map(item=>children(item))
    .reduce((prev, curr) => {
      return <>{prev} | {curr}</>
    })
}
export const Footer = () => {
    return <footer className="footer mt-auto">
        <div className="container p-3">
            <div className="text-end text-muted">
                <div className="footer-links">
                  <RenderLinks children={(item)=><a href={item.href} className="mx-2">{item.label}</a>}/>
                </div>
            </div>
        </div>
    </footer>
}

export const SmallFooter = () => {
  return <div className="text-center text-muted small">
    <RenderLinks children={(item)=><a href={item.href}>{item.label}</a>}/>
  </div>;
}
