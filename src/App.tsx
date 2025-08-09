import React, { useState, useEffect } from 'react';
import { Calculator, Users, DollarSign, Check, AlertTriangle, Plus, Minus } from 'lucide-react';

interface Person {
  id: number;
  name: string;
  amount: number;
}

type SplitMode = 'equal' | 'individual';

function App() {
  const [totalBill, setTotalBill] = useState<number>(0);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(2);
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: 'Pessoa 1', amount: 0 },
    { id: 2, name: 'Pessoa 2', amount: 0 }
  ]);
  const [currentDisplay, setCurrentDisplay] = useState<string>('0');
  const [inputMode, setInputMode] = useState<'total' | 'person'>('total');
  const [selectedPersonIndex, setSelectedPersonIndex] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<SplitMode>('equal');

  const totalConsumed = people.reduce((sum, person) => sum + person.amount, 0);
  const difference = totalBill - totalConsumed;
  const isBalanced = Math.abs(difference) < 0.01;
  const equalSplitAmount = totalBill > 0 ? totalBill / numberOfPeople : 0;

  useEffect(() => {
    if (people.length !== numberOfPeople) {
      const newPeople = Array.from({ length: numberOfPeople }, (_, index) => ({
        id: index + 1,
        name: `Pessoa ${index + 1}`,
        amount: people[index]?.amount || 0
      }));
      setPeople(newPeople);
    }
  }, [numberOfPeople]);

  const handleNumberClick = (num: string) => {
    if (currentDisplay === '0') {
      setCurrentDisplay(num);
    } else {
      setCurrentDisplay(prev => prev + num);
    }
  };

  const handleDecimalClick = () => {
    if (!currentDisplay.includes('.')) {
      setCurrentDisplay(prev => prev + '.');
    }
  };

  const handleClearClick = () => {
    setCurrentDisplay('0');
  };

  const handleEnterClick = () => {
    const value = parseFloat(currentDisplay);
    
    if (inputMode === 'total') {
      setTotalBill(value);
    } else {
      const updatedPeople = [...people];
      updatedPeople[selectedPersonIndex].amount = value;
      setPeople(updatedPeople);
    }
    
    setCurrentDisplay('0');
  };

  const handleDeleteClick = () => {
    if (currentDisplay.length > 1) {
      setCurrentDisplay(prev => prev.slice(0, -1));
    } else {
      setCurrentDisplay('0');
    }
  };

  const handleResetAll = () => {
    setTotalBill(0);
    setNumberOfPeople(2);
    setPeople([
      { id: 1, name: 'Pessoa 1', amount: 0 },
      { id: 2, name: 'Pessoa 2', amount: 0 }
    ]);
    setCurrentDisplay('0');
    setInputMode('total');
    setSelectedPersonIndex(0);
    setSplitMode('equal');
  };

  const adjustPeopleCount = (increment: boolean) => {
    if (increment) {
      setNumberOfPeople(prev => Math.min(prev + 1, 20));
    } else {
      setNumberOfPeople(prev => Math.max(prev - 1, 1));
    }
  };

  const calculateProportionalSplit = () => {
    if (totalConsumed === 0) return people;
    
    return people.map(person => ({
      ...person,
      proportionalAmount: (person.amount / totalConsumed) * totalBill
    }));
  };

  const proportionalSplit = calculateProportionalSplit();

  const ButtonComponent = ({ onClick, children, className = '', disabled = false }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-gradient-to-b from-gray-300 to-gray-400 hover:from-gray-200 hover:to-gray-300
        active:from-gray-400 active:to-gray-500 disabled:from-gray-200 disabled:to-gray-300
        disabled:opacity-50 disabled:cursor-not-allowed
        rounded-lg shadow-lg active:shadow-md transform active:scale-95
        transition-all duration-100 font-semibold text-gray-800
        ${className}
      `}
    >
      {children}
    </button>
  );

  const NumberButton = ({ number }: { number: string }) => (
    <ButtonComponent
      onClick={() => handleNumberClick(number)}
      className="h-12 text-lg"
    >
      {number}
    </ButtonComponent>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-400 to-gray-200 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator className="w-8 h-8 text-purple-800" />
            <h1 className="text-2xl font-bold text-gray-950">Racha Fácil</h1>
          </div>
          <p className="text-gray-950 text-sm">Calcular a conta nunca ficou tão Fácil!</p>
        </div>

        {/* Calculator Body */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border-4 border-gray-600">
          
          {/* Display */}
          <div className="bg-gray-900 rounded-lg p-4 mb-4 border-2 border-gray-700">
            <div className="text-green-400 text-xs mb-1 flex items-center gap-2">
              {inputMode === 'total' ? (
                <>
                  <DollarSign className="w-3 h-3" />
                  VALOR TOTAL
                </>
              ) : (
                <>
                  <Users className="w-3 h-3" />
                  {people[selectedPersonIndex]?.name.toUpperCase()}
                </>
              )}
            </div>
            <div className="text-white text-right text-2xl font-mono">
              R$ {currentDisplay}
            </div>
          </div>

          {/* Mode Selection */}
          <div className={`flex mb-4 bg-gray-700 rounded-lg p-1 ${splitMode === 'individual' ? '' : 'opacity-50'}`}>
            <button
              onClick={() => setInputMode('total')}
              disabled={splitMode === 'equal'}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                inputMode === 'total' && splitMode === 'individual'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white disabled:cursor-not-allowed'
              }`}
            >
              Valor Total
            </button>
            <button
              onClick={() => setInputMode('person')}
              disabled={splitMode === 'equal'}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                inputMode === 'person' && splitMode === 'individual'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white disabled:cursor-not-allowed'
              }`}
            >
              Por Pessoa
            </button>
          </div>

          {/* People Count Control */}
          <div className="flex items-center justify-center gap-4 mb-4 bg-gray-700 rounded-lg p-3">
            <Users className="w-4 h-4 text-gray-300" />
            <button
              onClick={() => adjustPeopleCount(false)}
              className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-white font-semibold w-8 text-center">
              {numberOfPeople}
            </span>
            <button
              onClick={() => adjustPeopleCount(true)}
              className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Split Mode Selection */}
          {totalBill > 0 && (
            <div className="flex mb-4 bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setSplitMode('equal')}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                  splitMode === 'equal'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Divisão Igual
              </button>
              <button
                onClick={() => setSplitMode('individual')}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                  splitMode === 'individual'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Por Consumo
              </button>
            </div>
          )}

          {/* Person Selection (when in person mode) */}
          {inputMode === 'person' && splitMode === 'individual' && (
            <div className="mb-4">
              <select
                value={selectedPersonIndex}
                onChange={(e) => setSelectedPersonIndex(parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                {people.map((person, index) => (
                  <option key={person.id} value={index}>
                    {person.name} - R$ {person.amount.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Calculator Buttons */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {/* Row 1 */}
            <ButtonComponent
              onClick={handleClearClick}
              className="h-12 text-red-700 font-bold"
            >
              C
            </ButtonComponent>
            <ButtonComponent
              onClick={handleDeleteClick}
              className="h-12 text-orange-700 font-bold"
            >
              ⌫
            </ButtonComponent>
            <div className="col-span-2">
              <ButtonComponent
                onClick={handleEnterClick}
                className="h-12 w-full bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-bold"
              >
                ENTER
              </ButtonComponent>
            </div>

            {/* Row 2 */}
            <NumberButton number="7" />
            <NumberButton number="8" />
            <NumberButton number="9" />
            <ButtonComponent
              onClick={handleDecimalClick}
              className="h-12 text-lg"
            >
              .
            </ButtonComponent>

            {/* Row 3 */}
            <NumberButton number="4" />
            <NumberButton number="5" />
            <NumberButton number="6" />
            <NumberButton number="0" />

            {/* Row 4 */}
            <NumberButton number="1" />
            <NumberButton number="2" />
            <NumberButton number="3" />
            <div></div>
          </div>

          {/* Reset Button */}
          <div className="mb-4">
            <ButtonComponent
              onClick={handleResetAll}
              className="w-full h-10 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold text-sm"
            >
              🔄 ZERAR TUDO
            </ButtonComponent>
          </div>

          {/* Status Display */}
          <div className="bg-gray-700 rounded-lg p-3 mb-4 space-y-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-300">Total da conta:</span>
              <span className="text-white font-semibold">R$ {totalBill.toFixed(2)}</span>
            </div>
            
            {splitMode === 'equal' && totalBill > 0 && (
              <div className="bg-green-800 rounded-lg p-3 border border-green-600">
                <h3 className="text-green-300 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  DIVISÃO IGUAL
                </h3>
                <div className="text-center mb-2">
                  <div className="text-green-100 text-lg font-bold">
                    R$ {equalSplitAmount.toFixed(2)}
                  </div>
                  <div className="text-green-300 text-xs">
                    por pessoa ({numberOfPeople} pessoas)
                  </div>
                </div>
                <div className="space-y-1">
                  {people.slice(0, numberOfPeople).map((person) => (
                    <div key={person.id} className="flex justify-between items-center text-sm">
                      <span className="text-green-200">{person.name}:</span>
                      <span className="text-green-100 font-semibold">
                        R$ {equalSplitAmount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {splitMode === 'individual' && (
              <>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-300">Total consumido:</span>
              <span className="text-white font-semibold">R$ {totalConsumed.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Diferença:</span>
              <div className="flex items-center gap-2">
                {isBalanced ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                )}
                <span className={`font-semibold ${
                  difference > 0 ? 'text-yellow-400' : difference < 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  R$ {Math.abs(difference).toFixed(2)}
                  {difference > 0 ? ' (falta)' : difference < 0 ? ' (sobra)' : ' ✓'}
                </span>
              </div>
            </div>
              </>
            )}
          </div>

          {/* Results */}
          {totalBill > 0 && splitMode === 'individual' && people.some(p => p.amount > 0) && (
            <div className="bg-gray-700 rounded-lg p-3">
              <h3 className="text-purple-300 font-semibold text-sm mb-3">
                DIVISÃO PROPORCIONAL
              </h3>
              <div className="space-y-2">
                {proportionalSplit.map((person, index) => (
                  <div key={person.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{person.name}:</span>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        R$ {(person as any).proportionalAmount?.toFixed(2) || '0.00'}
                      </div>
                      {person.amount > 0 && (
                        <div className="text-xs text-gray-400">
                          (consumiu: R$ {person.amount.toFixed(2)})
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-gray-950 text-base">
            Calculadora de divisão proporcional de contas
          </p>
          <p className="text-purple-900 text-sm">
            Desenvolvida por Priscila Ramonna
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;