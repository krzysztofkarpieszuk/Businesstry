import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions';
import {currencies} from '../../currencies';


function CurrencyPage(props) {
	return (
			<main className="currency-main">
				<CurrencyPageIntro />
				<CurrencyCalculator {...props}/>
			</main>
		);
}

function CurrencyPageIntro() {
	return (
		<section className="currency-main__intro pt-3 pt-md-4">
			<div className="container">
				<h2 className="text-center">Currency Calculator</h2>
			</div>
		</section>
	);
};

function CurrencyCalculator(props) {
	const {
		baseCurr,
		quoteCurr,
		onBaseCurrencySelect,
		onQuoteCurrencySelect,
		rates,
		baseCurrencyValue,
		onChangeButtonClick
	} = props;

	const currencyOption = currencies.map(currency => {
		return (
			<option value={currency.code} key={currency.code} title={currency.code}>
				{currency.name}
			</option>
		);
	});

	return (
		<div className="currency-main__calculator">
				<div className="container">
					<div className="row no-gutters">
						<div className="col-sm-5">
							<select className="form-control mt-4"
									id="base-currency"
									value={baseCurr}
									onChange={(event) => onBaseCurrencySelect(event.target.value, baseCurrencyValue, quoteCurr)}>
								<option value="">Select base currency</option>
								{currencyOption}
							</select>
						</div>

						<div className="offset-5 offset-sm-0 col-2 mt-4 d-flex justify-content-center">
							<button className="btn btn-info" onClick={() => onChangeButtonClick(baseCurr, baseCurrencyValue, quoteCurr)}>
								<i className="fas fa-fw fa-exchange-alt" title="Swap currencies"></i>
							</button>
						</div>

						<div className="col-sm-5">
							<select className="form-control mt-4"
									id="quote-currency"
									value={quoteCurr}
									onChange={(event) => onQuoteCurrencySelect(event.target.value, baseCurrencyValue, rates)}>
								<option value="">Select quote currency</option>
								{currencyOption}
							</select>
						</div>
					</div>
					<CurrencyValues {...props}/>
				</div>
			</div>
	)
}

function CurrencyValues(props) {
	const {
		displayValueBox,
		rates,
		baseCurr,
		quoteCurr,
		onCurrencyInputChange,
		convertedValue,
		baseCurrencyValue,
		rate
	} = props;

	const visibleValues = displayValueBox ? "visible" : "";

	if ((displayValueBox === 'none') && (quoteCurr !== "") && (baseCurr !== "") && (rates !== [])) {
		return null;
	}

	return (
		<div className={`currency-main__calculator-value row mt-4 ${visibleValues}`}>
			<div className="col-8 col-sm-6 mt-2 d-flex align-items-center">
				<div className="input-group">
					<input type="number"
						   defaultValue={0}
						   step="1"
						   className="form-control"
						   onChange={(event) => onCurrencyInputChange(event.target.value, rate )}/>
					<div className="input-group-append">
						<div className="input-group-text">{baseCurr}</div>
					</div>
				</div>
			</div>

			<div className="col-8 col-sm-5 mt-2">
				<p className="h2 text-center">
					{convertedValue === "NaN" ? `${baseCurrencyValue}.00` : convertedValue} {quoteCurr}
				</p>
			</div>

			<div className="col-8 col-sm-6 mt-2">
				<p className="lead">
					Exchange rate: <span className="h5">{rate}</span>
				</p>
			</div>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		baseCurr: state.calculator.baseCurrency,
		quoteCurr: state.calculator.quoteCurrency,
		rates: state.calculator.rates,
		convertedValue: state.calculator.convertedValue,
		displayValueBox: state.calculator.displayValueBox,
		baseCurrencyValue: state.calculator.baseCurrencyValue,
		rate: state.calculator.rate
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onBaseCurrencySelect: (baseCurrency, baseValue, quoteCurrency) => dispatch(actionCreators.selectBaseCurrency(baseCurrency, baseValue, quoteCurrency)),
		onQuoteCurrencySelect: (quoteCurrency, baseValue, rates) => dispatch(actionCreators.selectQuoteCurrency(quoteCurrency, baseValue, rates)),
		onCurrencyInputChange: (inputValue, rate) => dispatch(actionCreators.handleInputChange(inputValue, rate)),
		onChangeButtonClick: (baseCurrency, baseValue, quoteCurrency) => dispatch(actionCreators.swapCurrencies(baseCurrency, baseValue, quoteCurrency))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyPage);
