//import { useContext  } from "react"//importando forma de se usar o contexto
import ChangeCounter from "../components/ChangeCounter"
//import { CounterContext } from "../context/CounterContext"//importando variavel com elementos a serem utilizados

//4 - refatorando com hook
import { useCounterContext } from "../hooks/useCounterContext"//importando hook que contem o context

const Home = () => {
  //const { counter } = useContext(CounterContext)//desustruturando counter do useContext-CounterContext
  const { counter } = useCounterContext()//invocando a funcao do hook

  return (
    <div>
      <h1>Home</h1>
      <p>Valor do contador: {counter}</p>
      {/* alterando valor contexto */}
      <ChangeCounter />
    </div>
  )
}

export default Home

