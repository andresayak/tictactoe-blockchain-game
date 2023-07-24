export const Loader = ({isShow}: {isShow: boolean}) =>{
  return <div className={"loader"+(isShow?" d-block":" d-none")}>Loading ... </div>
}
