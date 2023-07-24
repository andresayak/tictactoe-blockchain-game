import { Button, Table } from "reactstrap";
import { GameType, gameTypes } from "../types/game";
import Moment from "react-moment";
import { PlayTicTacToeModal } from "./modals/TicTacToe/PlayTicTacToeModal";
import { ConfigType } from "../redux/reducers/systemReducer";
import { Link } from "react-router-dom";
import { shortenAddress } from "@usedapp/core";
import { ethers } from "ethers/lib.esm";

type PropType = {
    items: GameType[];
    configs: ConfigType
}

export const GameList = ({items, configs}: PropType) => {
    return <Table>
        <thead>
        <tr>
            <th>Type</th>
            <th>Creator</th>
            <th>Bet</th>
            <th>Timeout</th>
            <th>Size</th>
            <th>Created At</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        {items.map((item, index)=>{
            return <tr key={index}>
                <td>
                    {item.type!==undefined?gameTypes[item.type]:'--'}
                </td>
                <td>
                    <span title={item.creator}>{shortenAddress(item.creator)}</span>
                </td>
                <td>
                    {ethers.utils.formatUnits(item.amount, item.tokenDecimals)} {item.token}
                </td>
                <td>
                    {item.timeout}
                </td>
                <td>
                    {item.size}
                </td>
                <td>
                    <Moment date={item.createdAt} fromNow />
                    <div className='small'>
                        <Moment date={item.createdAt}/>
                    </div>
                </td>
                <td className="text-end">
                    <Button tag={Link} to={"/game/"+item.address} color="light" className="me-2">View</Button>
                    <PlayTicTacToeModal game={item} configs={configs} />
                </td>
            </tr>;
        })}
        </tbody>
    </Table>
}
