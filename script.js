// A JavaScript module can import reusable code. Chess is a library that supplies standard chess moves and rules.
import { Chess } from 'https://esm.sh/chess.js@1.4.0';
// These keys connect each color and piece type to the character drawn on the board.
const symbols={wk:'♔',wq:'♕',wr:'♖',wb:'♗',wn:'♘',bp:'♟',bk:'♚',bq:'♛',br:'♜',bb:'♝',bn:'♞',wp:'♙'};
// This section stores the changing game state. const names a value that will not be reassigned; let names a value that can change. localStorage is small browser storage that remembers a value after the page closes. The try/catch blocks handle cases where the browser blocks that storage.
const files='abcdefgh', boardEl=document.querySelector('#board');function getSavedFlip(){try{return localStorage.getItem('shuffleChessFlipped')==='true'}catch{return false}}let game=new Chess(), selected=null,targets=[],flipped=getSavedFlip(),plies=0,history=[],lastMove=null,shuffleMoves=0,shuffleEvent='',pendingPromotion=null;
// The Document Object Model (DOM) is the browser tree of page elements. A selector is a pattern for finding page elements; this helper finds one using a CSS selector such as #board.
const $=s=>document.querySelector(s);
// Draw the current game state in the page. Each square is a button that the player can click.
function render(){boardEl.innerHTML='';let checked=game.isCheck()?game.turn():null;for(let ri=0;ri<8;ri++)for(let ci=0;ci<8;ci++){let file=flipped?7-ci:ci,rank=flipped?ri+1:8-ri,sq=files[file]+rank,piece=game.get(sq),b=document.createElement('button');b.className='sq '+((file+rank)%2?'dark':'light');b.setAttribute('role','gridcell');b.setAttribute('aria-label',`${sq}${piece?`, ${piece.color==='w'?'white':'black'} ${piece.type}`:''}`);if(sq===selected)b.classList.add('selected');if(lastMove&&(sq===lastMove.from||sq===lastMove.to))b.classList.add('last');if(checked&&piece?.type==='k'&&piece.color===checked)b.classList.add('check');if(ci===0){let c=document.createElement('span');c.className='coord';c.textContent=rank;b.append(c)}if(ri===7){let c=document.createElement('span');c.className='coord';c.style.left='auto';c.style.right='4px';c.style.top='auto';c.style.bottom='1px';c.textContent=files[file];b.append(c)}if(piece){let p=document.createElement('span');p.className='piece '+(piece.color==='w'?'white':'black');p.textContent=symbols[piece.color+piece.type];b.append(p)}if(targets.includes(sq)){let dot=document.createElement('span');dot.className=piece?'capture':'dot';b.append(dot)}b.addEventListener('click',()=>clickSquare(sq));boardEl.append(b)}updateSide()}
// Update the status message, shuffle counter, button state, and move history beside the board.
function updateSide(){let turn=game.turn(), name=turn==='w'?'White':'Black';$('#turnDot').className='turn-dot '+(turn==='b'?'black':'');let msg=game.isCheckmate()?`${name==='White'?'Black':'White'} wins by checkmate`:game.isDraw()?'Draw':game.isCheck()?`${name} is in check`:game.isGameOver()?'Game over':`${name} to move`;$('#status').textContent=msg;$('#detail').textContent=game.isGameOver()?'Start a new game to play again.':game.isCheck()?'Your king is under attack.':selected?'Legal moves are highlighted on the board.':'Choose a piece to see its legal moves.';$('#counter').textContent=`${shuffleMoves} / 3`;$('#fill').style.width=`${shuffleMoves/3*100}%`;$('#event').textContent=shuffleEvent;$('#plyCount').textContent=`${plies} ${plies===1?'move':'moves'}`;$('#undo').disabled=history.length===0;let hist=game.history();$('#moves').innerHTML='';for(let i=0;i<hist.length;i+=2){let d=document.createElement('div');d.className='move-row';d.innerHTML=`<span class="move-num">${Math.floor(i/2)+1}.</span>${hist[i]}${hist[i+1]?' &nbsp; '+hist[i+1]:''}`;$('#moves').append(d)}$('#moves').scrollTop=$('#moves').scrollHeight}
// Handle a board click: select a piece, show legal destinations (squares allowed by the chess rules), or make the chosen move.
function clickSquare(sq){if(game.isGameOver())return;let piece=game.get(sq);if(selected&&targets.includes(sq)){let opts=game.moves({square:selected,verbose:true}).filter(m=>m.to===sq);if(opts.some(m=>m.flags.includes('p'))){promotionDialog(selected,sq);return}makeMove(selected,sq);return}if(piece&&piece.color===game.turn()){selected=sq;targets=game.moves({square:sq,verbose:true}).map(m=>m.to)}else{selected=null;targets=[]}render()}
// Show a choice when a pawn reaches the far edge and can become a queen, rook, bishop, or knight.
function promotionDialog(from,to){pendingPromotion={from,to};let col=game.turn(),items=['q','r','b','n'];$('#choices').innerHTML='';for(let t of items){let b=document.createElement('button');b.textContent=symbols[col+t];b.className='piece '+(col==='w'?'white':'black');b.onclick=()=>{makeMove(from,to,t);$('#promotion').classList.remove('show')};$('#choices').append(b)}$('#promotion').classList.add('show')}
// Save the old position for Undo, make a move, update the shuffle counter, and redraw the page.
function makeMove(from,to,promotion){history.push({fen:game.fen(),plies,shuffleMoves,lastMove,shuffleEvent});let m;try{m=game.move({from,to,...(promotion?{promotion}:{})})}catch{history.pop();return}if(!m){history.pop();return}plies++;shuffleMoves++;lastMove={from:m.from,to:m.to};selected=null;targets=[];shuffleEvent='';if(shuffleMoves===3){randomize();shuffleMoves=0;shuffleEvent='Pieces shuffled!'}render()}
// Shuffle each color pieces among squares occupied by that color.
function randomize(){
// A copy of the board is used to rearrange pieces before making the new position.
 const bd=game.board().map(row=>row.map(p=>p?{...p}:null));
 // Shuffle all occupied squares independently within each color, including kings and pawns.
// Process one color at a time so white and black pieces do not swap with each other.
 for(const color of ['w','b']){
  const spots=[];
  for(let r=0;r<8;r++)for(let f=0;f<8;f++)if(bd[r][f]?.color===color)spots.push({r,f});
  const pieces=spots.map(({r,f})=>({...bd[r][f]}));
// Fisher-Yates is a common list-shuffling method: each item swaps with a randomly chosen earlier item.
  for(let i=pieces.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pieces[i],pieces[j]]=[pieces[j],pieces[i]]}
  for(const {r,f} of spots)bd[r][f]=null;
  for(let i=0;i<spots.length;i++){const {r,f}=spots[i];bd[r][f]=pieces[i]}
 }
// Convert the board rows to FEN (Forsyth-Edwards Notation), a text format that describes a chess position. skipValidation allows this variant to load illegal shuffled positions.
 const rows=bd.map(row=>{let out='',empty=0;for(const p of row){if(!p)empty++;else{if(empty){out+=empty;empty=0}out+=p.color==='w'?p.type.toUpperCase():p.type}}if(empty)out+=empty;return out}).join('/');
 const fen=`${rows} ${game.turn()} - - 0 ${Math.max(1,Math.ceil((plies+1)/2))}`;
 // The variant allows any same-color shuffle, even when that makes an illegal chess position.
 game=new Chess(fen,{skipValidation:true});
}
// Start a new game and reset selections, counters, history, orientation, and the saved orientation choice.
function fresh(){game=new Chess();selected=null;targets=[];flipped=false;try{localStorage.setItem('shuffleChessFlipped','false')}catch{}plies=0;history=[];lastMove=null;shuffleMoves=0;shuffleEvent='';$('#orientation').textContent='White at bottom';render()}
// These click handlers connect the Undo, New game, and Flip board buttons to their actions.
$('#undo').onclick=()=>{if(!history.length)return;let x=history.pop();game=new Chess(x.fen);plies=x.plies;shuffleMoves=x.shuffleMoves;lastMove=x.lastMove;shuffleEvent=x.shuffleEvent;selected=null;targets=[];render()};$('#new').onclick=fresh;$('#flip').onclick=()=>{flipped=!flipped;try{localStorage.setItem('shuffleChessFlipped',String(flipped))}catch{}$('#orientation').textContent=flipped?'Black at bottom':'White at bottom';render()};$('#orientation').textContent=flipped?'Black at bottom':'White at bottom';render();

