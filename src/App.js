import React, { useCallback, useState, useEffect, useReducer, useRef } from 'react';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import sp_node from './data/sp_node.json';
import sp_edge from './data/sp_edge.json';
import sp_news_node from './data/sp_news_node.json';
import sp_news_edge from './data/sp_news_edge.json';
import kos_node from './data/kos_node.json';
import kos_edge from './data/kos_edge.json';

import './App.css';

import MultiSelector from './components/Selector/MultiSelector';
import InputSlider from './components/Selector/InputSlider';
import Selector from './components/Selector/Selector';

const SP_DICS = ['Auto & Logistics',
	'Banks',
	'Computer, Electricity & IT',
	'Consulting & Financial Services',
	'Entertainment & Leisure',
	'Healthcare',
	'Healthcare, Pharmaceuticals, and Biotechnology',
	'Insurance',
	'Oil, Gas & Chemicals',
	'Others',
	'Real Estate',
	'Utilities'
]

const SP_NEWS_DICS = ['Consumer Staples and Discretionary',
	'Energy and Utilities',
	'Financials and Real Estate',
	'Healthcare',
	'Industrials',
	'Information Technology',
	'Materials',
	'Telecommunications and Multi-Purpose Groups']

const SP_GICS = ['Basic Materials',
	'Communication Services',
	'Consumer Cyclical',
	'Consumer Defensive',
	'Energy',
	'Financial Services',
	'Healthcare',
	'Industrials',
	'Real Estate',
	'Technology',
	'Techonology',
	'Utilities'
]

const SP_NEWS_GICS = ['Consumer Discretionary',
	'Consumer Staples',
	'Energy',
	'Financials',
	'Health Care',
	'Industrials',
	'Information Technology',
	'Materials',
	'Real Estate',
	'Telecommunication Services',
	'Utilities']

const KOS_DICS = ['IT서비스',
	'가전, 전자장비, 기타 부품 및 제품',
	'건설',
	'건설, 장비, 기기',
	'광고, 디지털컨텐츠, 엔터테인먼트',
	'교육서비스 및 문구류',
	'기계장비',
	'반도체',
	'섬유의복 및 유통',
	'운수장비',
	'은행, 증권 및 기타금융',
	'음식료품, 담배 및 기타화학',
	'의료, 제약 및 생물공학',
	'전기전자',
	'전자부품',
	'철강금속',
	'항공,운수 및 통신장비',
	'화학, 섬유']

const KOS_GICS = ['IT부품',
	'건설업',
	'교육',
	'금속',
	'금융',
	'금융서비스',
	'기계',
	'기계,장비',
	'기타금융업',
	'기타서비스',
	'기타제조',
	'농업',
	'도매',
	'디지털컨텐츠',
	'미분류',
	'반도체',
	'방송서비스',
	'보험업',
	'비금속',
	'비금속광물',
	'사업지원',
	'서비스업',
	'섬유,의류',
	'섬유의복',
	'소매',
	'소프트웨어',
	'숙박,음식',
	'여행운송',
	'연구,개발',
	'연료광업',
	'오락,문화',
	'운송장비,부품',
	'운수장비',
	'운수창고업',
	'유통업',
	'육상운송',
	'은행',
	'음식료,담배',
	'음식료품',
	'의료,정밀기기',
	'의료정밀',
	'의약품',
	'인터넷',
	'일반전기전자',
	'자동차판매',
	'전기,가스',
	'전기가스업',
	'전기전자',
	'전문건설',
	'전문기술',
	'정보기기',
	'제약',
	'종이,목재',
	'종이목재',
	'종합건설',
	'증권',
	'철강금속',
	'출판,매체복제',
	'컴퓨터서비스',
	'통신서비스',
	'통신업',
	'통신장비',
	'화학',
	'환경']

const generateColor = (string) => {
	var hash = 0;
	for (var i = 0; i < string.length; i++) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}
	var colour = '#';
	for (var i = 0; i < 3; i++) {
		var value = (hash >> (i * 8)) & 0xFF;
		colour += ('00' + value.toString(16)).substr(-2);
	}
	return colour;
}


function App() {


	/**
	 * DETECT WINDOW RESIZE TO LOCATE NETWORK AT CENTER
	 */
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight
	});

	const handleResize = () => {
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight
		})
	}

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		}
	}, []);

	// TOGGLE DIMENSION (2D, 3D)
	const [dimension, setDimension] = useState(true);

	// FORCE UPDATE FUNCTION
	const [, forceUpdate] = useReducer(x => x + 1, 0);

	// ORIGINAL FULL DATA
	const [fullData, setFullData] = useState({
		nodes: [],
		links: []
	})

	// CONFIGURATION APPLIED DATA (TO BE RENDERED)
	const [data, setData] = useState({
		nodes: sp_node,
		links: sp_edge
	});


	const [config, setConfig] = useState({
		n: fullData.nodes.length,
		market: "",
		viewSource: "10K",
		DIC: [],
		GICS: [],
	});

	const [condition, setCondition] = useState(false);

	const [summary, setSummary] = useState({
		marketCap: [],
		degree: [],
	})

	const [DICS, setDICS] = useState([]);
	const [GICS, setGICS] = useState([]);

	// WHEN CONFIGURATION UPDATES
	useEffect(() => {
		if (config.market !== '') {
			if (config.market === 'S&P500') {

				if (config.viewSource === '10K') {
					setDICS(SP_DICS);
					setGICS(SP_GICS);
					setFullData({
						nodes: sp_node,
						links: sp_edge
					})
				}
				else if (config.viewSource === '10K News') {
					setDICS(SP_NEWS_DICS);
					setGICS(SP_NEWS_GICS);
					setFullData({
						nodes: sp_news_node,
						links: sp_news_edge
					})
				}
			}
			else {
				if (config.viewSource === '10K') {
					setDICS(KOS_DICS);
					setGICS(KOS_GICS);
					setFullData({
						nodes: kos_node,
						links: kos_edge
					})
				}
				else if (config.viewSource === '10K News') {
					setDICS(KOS_DICS);
					setGICS(KOS_GICS);
					setFullData({
						nodes: kos_node,
						links: kos_edge
					})
				}
			}
		}
		else {
			setDICS([]);
			setGICS([]);
			setFullData({
				nodes: [],
				links: []
			})
		}
	}, [config.market, config.viewSource])

	useEffect(() => {

		// Check if all configurations are set
		if (config.market !== "" && config.DIC.length > 0 && config.GICS.length > 0) {
			setCondition(true);
		}
		else {
			setCondition(false);
			return;
		}

		console.log( fullData.nodes );


		// SELECT TOP-N (by market_cap) NODES
		let new_node = fullData.nodes.sort((a, b) => {
			return b.market_cap_raw - a.market_cap_raw;
		}).slice(0, config.n);

		// APPLY DIC LABELS SELECTION
		new_node = new_node.filter((node) => {
			return config.DIC.includes(node.community_labels);
		})

		// APPLY GICS LABELS SELECTION
		new_node = new_node.filter((node) => {
			return config.GICS.includes(node.GICS_sector);
		})

		// GET LINKS FROM NEWLY GROUPED NODE
		let new_node_id_list = new_node.map((node) => {
			return node.id;
		})


		let new_link = fullData.links.filter((link) => {
			return (new_node_id_list.includes(link.source) && new_node_id_list.includes(link.target)) ||
				(new_node_id_list.includes(link.source.id) && new_node_id_list.includes(link.target.id));
		})


		// [*_TODO_*]  
		// GET FIRST NEIGHBOR / SECOND NEIGHBOR WITH NEW DATA

		setSelected(false);

		setData({
			nodes: new_node,
			links: new_link
		})

	}, [config])


	const [open, setOpen] = useState(false);

	const [selected, setSelected] = useState(false);



	useEffect(() => {

		let top5MarketCap = data.nodes.sort((a, b) => {
			return b.market_cap_raw - a.market_cap_raw;
		}).slice(0, 5);

		let top5Degree = data.nodes.sort((a, b) => {
			return b.degree - a.degree;
		}).slice(0, 5);

		setSummary({
			...summary,
			marketCap: top5MarketCap,
			degree: top5Degree
		})

	}, [data])




	/**
	 * NETWORK INTERACTION FUNCTIONS
	 */

	const handleNodeIdClick = (id, out, event) => {

		let node = fullData.nodes.filter((node) => {
			return node.id === id;
		})[0];

		if (out) {
			return node;
		}
		else {
			handleNodeClick(node, event);
			return node;
		}


	}

	const updateData = (nodes) => {


		data.nodes.map((node) => {
			if (!nodes.includes(node.id)) {
				node.selected = false;
			}
			else {
				node.selected = true;
			}
		})

		data.links.map((link) => {
			if (nodes.includes(link.source.id) && nodes.includes(link.target.id)) {
				link.selected = true;
			}
			else {
				link.selected = false;
			}
		});
	}

	const handleNodeClick = (node, event) => {

		setSelected(node);

		const first = node.first;
		const second = node.second;

		updateData([node.id, ...first, ...second])
		forceUpdate();

	}

	const resetHighlight = (event) => {

		setSelected(null);

		data.nodes.map((node) => {
			node.selected = true;
		})

		data.links.filter((link) => {
			link.selected = true;
		});

		forceUpdate();
	}

	return (
		<div className="App">
			<div className={`headerContainer`}>
				<a className={`header noselect`}>
					DIC Firm Network Visualization
				</a>
				{
					config.market !== '' ?
						<div className={`tabSelector`}>
							<div className={`tab noselect ${config.viewSource === '10K' ? "selected" : ""}`}
								onClick={(e) => {
									setConfig({
										...config,
										n: 0,
										viewSource: '10K',
										DIC: [],
										GICS: []
									})
									setOpen(false);
								}}
							>
								10K
							</div>
							<div className={`tab noselect ${config.viewSource === '10K News' ? "selected" : ""}`}
								onClick={(e) => {
									setConfig({
										...config,
										n: 0,
										viewSource: '10K News',
										DIC: [],
										GICS: []
									})
									setOpen(false);
								}}
							>
								10K News
							</div>
						</div>
						:
						null
				}
			</div>
			<div className={`bodyContainer`}>
				{
					open ?
						<React.Fragment>
							<div className={`networkSummaryContainer`}>
								<a className={`summaryTitle`}>
									NETWORK SUMMARY
								</a>
								<div className={`summarySection`}>
									<div className={`summaryContent`}>
										<div>
											<a style={{ fontWeight: 'bold' }}>
												DIC Industry :
											</a>
											{
												config.DIC.map((industry) => {
													return industry + ",  "
												})
											}
										</div>
										<div>
											<a style={{ fontWeight: 'bold' }}>
												View Source :
											</a>
											{ config.viewSource }
										</div>
										<div>
											<a style={{ fontWeight: 'bold' }}>
												Target Market :
											</a>
											{
												config.market
											}
										</div>
									</div>
								</div>
								<a className={`summaryTitle`}>
									Top 5 Market Cap
								</a>
								<div className={`summarySection`}>
									<div className={`summaryContent`}>
										{
											summary.marketCap.map((node, index) => (
												<div key={`marketcap_${index}`} onClick={(e) => {
													handleNodeClick(node, e);
												}}>
													- {node.company_name} : {node.market_cap}
												</div>
											))
										}
									</div>
								</div>
								<a className={`summaryTitle`}>
									Top 5 Degrees
								</a>
								<div className={`summarySection`}>
									<div className={`summaryContent`}>
										{
											summary.degree.map((node, index) => (
												<div key={`degree_${index}`} onClick={(e) => {
													handleNodeClick(node, e);
												}}>
													- {node.company_name} : {node.degree}
												</div>
											))
										}
									</div>
								</div>
							</div>
							<div className={`networkContainer`}>
								{
									dimension ?
										<ForceGraph2D
											backgroundColor="white"
											width={windowSize.width * 0.7}
											height={windowSize.height * 0.8}
											graphData={data}
											enableNodeDrag={false}

											cooldownTime={5000}
											nodeLabel={node => `${node.company_name}`}
											nodeColor={node => node.selected ? generateColor(node.GICS_sector) : 'rgba(225, 229, 233, 0.1)'}
											linkColor={link => link.selected ? "rgba(137, 146, 155, 0.9)" : 'rgba(225, 229, 233, 0.1)'}
											// linkDirectionalArrowLength={3.5}
											// linkDirectionalArrowRelPos={1}
											// linkCurvature={0.25}		
											linkWidth={0.3}
											onNodeClick={(node, event) => {
												handleNodeClick(node, event);
											}}
											onBackgroundClick={(event) => {
												resetHighlight(event);
											}}

										/>
										:
										<ForceGraph3D
											backgroundColor="white"
											width={windowSize.width * 0.7}
											height={windowSize.height * 0.8}
											graphData={data}
											enableNodeDrag={false}

											cooldownTime={5000}
											nodeLabel={node => `${node.company_name}`}
											nodeColor={node => node.selected ? generateColor(node.GICS_sector) : 'rgba(225, 229, 233, 0.1)'}
											linkColor={link => link.selected ? "rgba(137, 146, 155, 0.9)" : 'rgba(225, 229, 233, 0.1)'}
											// linkDirectionalArrowLength={3.5}
											// linkDirectionalArrowRelPos={1}
											// linkCurvature={0.25}		
											linkWidth={0.3}
											onNodeClick={(node, event) => {
												handleNodeClick(node, event);
											}}
											onBackgroundClick={(event) => {
												resetHighlight(event);
											}}

										/>
								}
							</div>
							{
								selected &&
								<div className={`networkInteractionBoardContainer`}>
									<a className={`summaryTitle`}>
										Selected Company Summary
									</a>
									<div className={`summarySection`} style={{ height: '50%', minHeight: '50%' }}>
										<a style={{ display: 'flex', flexDirection: 'row', fontSize: '12px', lineHeight: '26px' }}>
											<b> {selected.company_name} &nbsp; </b> ({selected.id})
										</a>
										<a style={{ display: 'flex', flexDirection: 'row', fontSize: '12px', lineHeight: '26px' }}>
											- &nbsp; <b> Market cap &nbsp; </b> : {selected.market_cap}
										</a>
										<a style={{ display: 'flex', flexDirection: 'row', fontSize: '12px', lineHeight: '26px' }}>
											- &nbsp; <b> DIC &nbsp; </b> : {selected.community_labels}
										</a>
										<a style={{ display: 'flex', flexDirection: 'row', fontSize: '12px', lineHeight: '26px' }}>
											- &nbsp; <b> {config.market === 'S&P500' ? "GICS" : "KOSPI"} &nbsp; </b> : {selected.GICS_sector}
										</a>
										<a style={{ display: 'flex', flexDirection: 'row', fontSize: '12px', lineHeight: '26px' }}>
											- &nbsp; <b> 1st-Tier Neighbors &nbsp; </b> :
											<div style={{ display: 'flex', flexDirection: 'column' }}>
												{
													selected.first.map((id, idx) => (
														<span key={`neighbor_${idx}`} onClick={(e) => {
															handleNodeIdClick(id, false, e)
														}}>
															{handleNodeIdClick(id, true, null).company_name}
														</span>
													))
												}
											</div>
										</a>
									</div>

									<a className={`summaryTitle`}>
										{config.market === 'S&P500' ? "GICS" : "KOSPI"} Sector Group
									</a>
									<div className={`summarySection`}>
										{
											GICS.map((sector, index) => (
												<div key={`legend_${index}`} className={`legend`}>
													<div className={`legendColor`} style={{ backgroundColor: generateColor(sector) }}>
													</div>
													<div className={`legendName`}>
														{sector}
													</div>
												</div>
											))
										}
									</div>
								</div>

							}
						</React.Fragment>
						:
						<div className={`optionSelector`}>
							<div className={`optionTitle noselect`}>
								Set Initial Configuration
							</div>
							<div className={`option`}>
								<Selector title={'Market'} config={config} setConfig={setConfig} />
							</div>
							<div className={`option`}>
								<InputSlider nodes={fullData.nodes} config={config} setConfig={setConfig} />
							</div>
							<div className={`option`}>
								<MultiSelector title={'DIC'} options={DICS} config={config} setConfig={setConfig} />
							</div>
							<div className={`option`}>
								<MultiSelector title={'GICS'} options={GICS} config={config} setConfig={setConfig} />
							</div>

							<div className={`generateBtn ${condition ? "active" : ""}`}
								onClick={(e) => setOpen(true)}>
								Generate
							</div>
						</div>
				}
			</div>
			{
				open &&
				<div className={`footerContainer`}>
					<div className={`resetBtn`}
						onClick={(e) => {
							setConfig({
								...config,
								n: 0,
								market: '',
								DIC: [],
								GICS: []
							})
							setOpen(false);
						}}>
						Re-configure
					</div>
					<div className={`toggleDimensionBtn`}
						onClick={(e) => {
							setDimension(!dimension);
						}}>
						{
							dimension ? "2D" : "3D"
						}
					</div>
				</div>
			}
			{/* <div className={`hello`}>
				Hello
			</div> */}
		</div>
	);
}

export default App;
