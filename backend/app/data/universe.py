from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass(frozen=True)
class Instrument:
    ticker: str
    name: str
    asset: str  # india | us | commodities | bonds | crypto
    sector: str
    subsector: str
    industry_group: str
    start_price: float  # INR
    vol: float  # daily vol
    drift: float  # daily drift
    bond_yield: Optional[float] = None  # annual yield for bonds
    pe: float = 22.0
    pb: float = 3.5
    roe: float = 0.16
    debt_equity: float = 0.4
    revenue_cr: float = 50_000.0
    qoq: float = 0.04
    yoy: float = 0.12

    @property
    def sleeve(self) -> str:
        """Boss v3.1 allocation bucket = asset class (india/us/commodities/bonds/crypto)."""
        return self.asset


STARTUP_TICKERS = {"ZOMATO", "NYKAA"}


def _i(*args, **kwargs) -> Instrument:
    return Instrument(*args, **kwargs)


# 148 instruments across all mandated industry groups.
UNIVERSE: List[Instrument] = [
    # —— India equity ——
    _i("RELIANCE", "Reliance Industries", "india", "Energy", "energy-oil", "Power / Energy / Oil", 2940, 0.016, 0.00035, pe=24, pb=2.4, roe=0.11, debt_equity=0.45, revenue_cr=900000, qoq=0.03, yoy=0.09),
    _i("TCS", "Tata Consultancy Services", "india", "IT", "IT-large", "IT / MNC / Startups / Consulting", 3920, 0.014, 0.00032, pe=28, pb=12.0, roe=0.42, debt_equity=0.05, revenue_cr=240000, qoq=0.02, yoy=0.08),
    _i("INFY", "Infosys", "india", "IT", "IT-large", "IT / MNC / Startups / Consulting", 1780, 0.015, 0.00028, pe=26, pb=8.5, roe=0.31, debt_equity=0.08, revenue_cr=153000, qoq=0.025, yoy=0.06),
    _i("HDFCBANK", "HDFC Bank", "india", "BFSI", "private banks", "BFSI / Bond / Cryptocurrency", 1640, 0.015, 0.00030, pe=18, pb=2.6, roe=0.17, debt_equity=0.0, revenue_cr=280000, qoq=0.04, yoy=0.14),
    _i("ICICIBANK", "ICICI Bank", "india", "BFSI", "private banks", "BFSI / Bond / Cryptocurrency", 1240, 0.016, 0.00033, pe=17, pb=3.0, roe=0.18, debt_equity=0.0, revenue_cr=186000, qoq=0.045, yoy=0.16),
    _i("SBIN", "State Bank of India", "india", "BFSI", "PSU banks", "BFSI / Bond / Cryptocurrency", 820, 0.018, 0.00028, pe=10, pb=1.5, roe=0.15, debt_equity=0.0, revenue_cr=420000, qoq=0.03, yoy=0.12),
    _i("AXISBANK", "Axis Bank", "india", "BFSI", "private banks", "BFSI / Bond / Cryptocurrency", 1180, 0.017, 0.00027, pe=13, pb=2.1, roe=0.16, debt_equity=0.0, revenue_cr=118000, qoq=0.035, yoy=0.13),
    _i("KOTAKBANK", "Kotak Mahindra Bank", "india", "BFSI", "private banks", "BFSI / Bond / Cryptocurrency", 1760, 0.016, 0.00022, pe=19, pb=2.8, roe=0.14, debt_equity=0.0, revenue_cr=62000, qoq=0.02, yoy=0.08),
    _i("INDUSINDBK", "IndusInd Bank", "india", "BFSI", "private banks", "BFSI / Bond / Cryptocurrency", 980, 0.022, 0.00010, pe=11, pb=1.4, roe=0.12, debt_equity=0.0, revenue_cr=48000, qoq=0.01, yoy=0.04),
    _i("BANDHANBNK", "Bandhan Bank", "india", "BFSI", "private banks", "BFSI / Bond / Cryptocurrency", 186, 0.028, 0.00005, pe=9, pb=1.1, roe=0.10, debt_equity=0.0, revenue_cr=18000, qoq=-0.01, yoy=0.02),
    _i("BAJFINANCE", "Bajaj Finance", "india", "BFSI", "NBFC", "BFSI / Bond / Cryptocurrency", 7120, 0.022, 0.00038, pe=29, pb=5.4, roe=0.22, debt_equity=3.8, revenue_cr=54000, qoq=0.06, yoy=0.24),
    _i("BAJAJFINSV", "Bajaj Finserv", "india", "BFSI", "NBFC", "BFSI / Bond / Cryptocurrency", 1680, 0.020, 0.00030, pe=16, pb=4.0, roe=0.18, debt_equity=2.1, revenue_cr=110000, qoq=0.04, yoy=0.15),
    _i("PFC", "Power Finance Corp", "india", "BFSI", "NBFC", "BFSI / Bond / Cryptocurrency", 480, 0.024, 0.00025, pe=7, pb=1.3, roe=0.19, debt_equity=8.5, revenue_cr=87000, qoq=0.03, yoy=0.11),
    _i("HDFCLIFE", "HDFC Life", "india", "Insurance", "insurance", "Healthcare / Pharma / Insurance", 680, 0.018, 0.00020, pe=82, pb=9.2, roe=0.11, debt_equity=0.1, revenue_cr=98000, qoq=0.04, yoy=0.14),
    _i("SBILIFE", "SBI Life", "india", "Insurance", "insurance", "Healthcare / Pharma / Insurance", 1720, 0.017, 0.00022, pe=74, pb=10.1, roe=0.13, debt_equity=0.05, revenue_cr=82000, qoq=0.035, yoy=0.12),
    _i("BHARTIARTL", "Bharti Airtel", "india", "Telecom", "telecom", "IT / MNC / Startups / Consulting", 1580, 0.016, 0.00034, pe=62, pb=10.5, roe=0.17, debt_equity=1.6, revenue_cr=150000, qoq=0.05, yoy=0.18),
    _i("ITC", "ITC", "india", "FMCG", "FMCG", "FMCG / Retail / Supply Chain", 470, 0.013, 0.00018, pe=26, pb=7.4, roe=0.28, debt_equity=0.02, revenue_cr=69000, qoq=0.02, yoy=0.07),
    _i("HINDUNILVR", "Hindustan Unilever", "india", "FMCG", "FMCG", "FMCG / Retail / Supply Chain", 2480, 0.012, 0.00016, pe=54, pb=11.2, roe=0.20, debt_equity=0.03, revenue_cr=61000, qoq=0.015, yoy=0.05),
    _i("NESTLEIND", "Nestle India", "india", "FMCG", "FMCG", "FMCG / Retail / Supply Chain", 2420, 0.012, 0.00017, pe=72, pb=38, roe=0.92, debt_equity=0.1, revenue_cr=20000, qoq=0.02, yoy=0.08),
    _i("BRITANNIA", "Britannia", "india", "FMCG", "FMCG", "FMCG / Retail / Supply Chain", 5450, 0.013, 0.00019, pe=58, pb=32, roe=0.55, debt_equity=0.3, revenue_cr=17000, qoq=0.025, yoy=0.09),
    _i("DABUR", "Dabur", "india", "FMCG", "FMCG", "FMCG / Retail / Supply Chain", 560, 0.014, 0.00014, pe=48, pb=8.8, roe=0.18, debt_equity=0.08, revenue_cr=12400, qoq=0.01, yoy=0.04),
    _i("PIDILITIND", "Pidilite", "india", "FMCG", "FMCG", "FMCG / Retail / Supply Chain", 3020, 0.014, 0.00020, pe=78, pb=16, roe=0.22, debt_equity=0.04, revenue_cr=12400, qoq=0.03, yoy=0.10),
    _i("TRENT", "Trent", "india", "Retail", "retail", "FMCG / Retail / Supply Chain", 6120, 0.024, 0.00045, pe=118, pb=28, roe=0.24, debt_equity=0.3, revenue_cr=14000, qoq=0.08, yoy=0.32),
    _i("DMART", "Avenue Supermarts", "india", "Retail", "retail", "FMCG / Retail / Supply Chain", 4780, 0.018, 0.00022, pe=92, pb=13, roe=0.14, debt_equity=0.05, revenue_cr=52000, qoq=0.04, yoy=0.16),
    _i("LT", "Larsen & Toubro", "india", "Infra", "infra", "Real Estate / Infra", 3620, 0.016, 0.00030, pe=32, pb=5.6, roe=0.15, debt_equity=1.1, revenue_cr=221000, qoq=0.04, yoy=0.13),
    _i("ULTRACEMCO", "UltraTech Cement", "india", "Materials", "cement", "Commodities / Raw Materials", 11240, 0.017, 0.00024, pe=42, pb=4.8, roe=0.12, debt_equity=0.25, revenue_cr=70000, qoq=0.02, yoy=0.07),
    _i("GRASIM", "Grasim", "india", "Materials", "cement", "Commodities / Raw Materials", 2580, 0.018, 0.00020, pe=28, pb=2.0, roe=0.08, debt_equity=0.7, revenue_cr=126000, qoq=0.015, yoy=0.05),
    _i("SUNPHARMA", "Sun Pharma", "india", "Pharma", "pharma", "Healthcare / Pharma / Insurance", 1720, 0.015, 0.00028, pe=38, pb=5.9, roe=0.16, debt_equity=0.08, revenue_cr=48000, qoq=0.04, yoy=0.11),
    _i("CIPLA", "Cipla", "india", "Pharma", "pharma", "Healthcare / Pharma / Insurance", 1480, 0.016, 0.00022, pe=26, pb=4.1, roe=0.15, debt_equity=0.05, revenue_cr=25800, qoq=0.03, yoy=0.09),
    _i("DRREDDY", "Dr Reddy's", "india", "Pharma", "pharma", "Healthcare / Pharma / Insurance", 6680, 0.016, 0.00021, pe=20, pb=3.6, roe=0.18, debt_equity=0.12, revenue_cr=28000, qoq=0.025, yoy=0.08),
    _i("DIVISLAB", "Divi's Labs", "india", "Pharma", "pharma", "Healthcare / Pharma / Insurance", 4780, 0.019, 0.00018, pe=68, pb=10.2, roe=0.15, debt_equity=0.02, revenue_cr=8200, qoq=0.01, yoy=0.03),
    _i("APOLLOHOSP", "Apollo Hospitals", "india", "Healthcare", "hospitals", "Healthcare / Pharma / Insurance", 6820, 0.018, 0.00026, pe=82, pb=12.4, roe=0.14, debt_equity=0.45, revenue_cr=19000, qoq=0.045, yoy=0.15),
    _i("MARUTI", "Maruti Suzuki", "india", "Auto", "auto", "Manufacturing / Auto / Aero / Semiconductor", 12480, 0.017, 0.00026, pe=26, pb=4.3, roe=0.16, debt_equity=0.02, revenue_cr=142000, qoq=0.03, yoy=0.10),
    _i("TATAMOTORS", "Tata Motors", "india", "Auto", "auto", "Manufacturing / Auto / Aero / Semiconductor", 980, 0.022, 0.00024, pe=11, pb=2.4, roe=0.22, debt_equity=0.6, revenue_cr=437000, qoq=0.02, yoy=0.06),
    _i("M&M", "Mahindra & Mahindra", "india", "Auto", "auto", "Manufacturing / Auto / Aero / Semiconductor", 2780, 0.019, 0.00032, pe=28, pb=4.8, roe=0.17, debt_equity=0.35, revenue_cr=139000, qoq=0.05, yoy=0.18),
    _i("EICHERMOT", "Eicher Motors", "india", "Auto", "auto", "Manufacturing / Auto / Aero / Semiconductor", 4820, 0.018, 0.00024, pe=32, pb=7.1, roe=0.22, debt_equity=0.04, revenue_cr=16500, qoq=0.035, yoy=0.12),
    _i("HEROMOTOCO", "Hero MotoCorp", "india", "Auto", "auto", "Manufacturing / Auto / Aero / Semiconductor", 5120, 0.017, 0.00018, pe=22, pb=4.0, roe=0.18, debt_equity=0.03, revenue_cr=38000, qoq=0.02, yoy=0.07),
    _i("BAJAJ-AUTO", "Bajaj Auto", "india", "Auto", "auto", "Manufacturing / Auto / Aero / Semiconductor", 9480, 0.016, 0.00022, pe=30, pb=8.2, roe=0.26, debt_equity=0.01, revenue_cr=45000, qoq=0.03, yoy=0.11),
    _i("TITAN", "Titan", "india", "Consumer", "jewellery", "FMCG / Retail / Supply Chain", 3380, 0.017, 0.00024, pe=82, pb=22, roe=0.27, debt_equity=0.6, revenue_cr=51000, qoq=0.04, yoy=0.14),
    _i("ASIANPAINT", "Asian Paints", "india", "Consumer", "paints", "FMCG / Retail / Supply Chain", 2480, 0.015, 0.00012, pe=52, pb=13, roe=0.25, debt_equity=0.08, revenue_cr=35500, qoq=0.01, yoy=0.03),
    _i("HAVELLS", "Havells", "india", "Consumer", "electricals", "Manufacturing / Auto / Aero / Semiconductor", 1880, 0.017, 0.00020, pe=68, pb=12, roe=0.18, debt_equity=0.05, revenue_cr=18600, qoq=0.025, yoy=0.08),
    _i("WIPRO", "Wipro", "india", "IT", "IT-large", "IT / MNC / Startups / Consulting", 520, 0.016, 0.00014, pe=22, pb=3.4, roe=0.16, debt_equity=0.18, revenue_cr=89700, qoq=0.01, yoy=0.02),
    _i("HCLTECH", "HCL Tech", "india", "IT", "IT-large", "IT / MNC / Startups / Consulting", 1640, 0.015, 0.00026, pe=25, pb=6.2, roe=0.24, debt_equity=0.06, revenue_cr=114000, qoq=0.03, yoy=0.09),
    _i("LTIM", "LTIMindtree", "india", "IT", "IT-mid", "IT / MNC / Startups / Consulting", 5680, 0.018, 0.00022, pe=32, pb=7.4, roe=0.23, debt_equity=0.04, revenue_cr=36000, qoq=0.02, yoy=0.07),
    _i("PERSISTENT", "Persistent Systems", "india", "IT", "IT-mid", "IT / MNC / Startups / Consulting", 5420, 0.022, 0.00030, pe=48, pb=12, roe=0.25, debt_equity=0.05, revenue_cr=9800, qoq=0.05, yoy=0.18),
    _i("COFORGE", "Coforge", "india", "IT", "IT-mid", "IT / MNC / Startups / Consulting", 6840, 0.021, 0.00028, pe=44, pb=11, roe=0.22, debt_equity=0.12, revenue_cr=9200, qoq=0.045, yoy=0.16),
    _i("POWERGRID", "Power Grid", "india", "Power", "energy-power", "Power / Energy / Oil", 328, 0.014, 0.00020, pe=18, pb=3.1, roe=0.17, debt_equity=1.4, revenue_cr=46000, qoq=0.02, yoy=0.08),
    _i("NTPC", "NTPC", "india", "Power", "energy-power", "Power / Energy / Oil", 412, 0.015, 0.00022, pe=16, pb=2.2, roe=0.13, debt_equity=1.5, revenue_cr=178000, qoq=0.025, yoy=0.09),
    _i("ONGC", "ONGC", "india", "Energy", "energy-oil", "Power / Energy / Oil", 278, 0.018, 0.00016, pe=8, pb=1.0, roe=0.13, debt_equity=0.35, revenue_cr=638000, qoq=-0.02, yoy=0.01),
    _i("COALINDIA", "Coal India", "india", "Energy", "energy-oil", "Power / Energy / Oil", 492, 0.017, 0.00014, pe=8, pb=2.6, roe=0.38, debt_equity=0.08, revenue_cr=142000, qoq=0.01, yoy=0.04),
    _i("IOC", "Indian Oil", "india", "Energy", "energy-oil", "Power / Energy / Oil", 168, 0.019, 0.00012, pe=7, pb=1.1, roe=0.14, debt_equity=0.7, revenue_cr=776000, qoq=-0.03, yoy=-0.02),
    _i("BPCL", "BPCL", "india", "Energy", "energy-oil", "Power / Energy / Oil", 328, 0.020, 0.00013, pe=8, pb=1.6, roe=0.18, debt_equity=0.55, revenue_cr=448000, qoq=-0.01, yoy=0.02),
    _i("TATASTEEL", "Tata Steel", "india", "Metals", "metals", "Commodities / Raw Materials", 154, 0.022, 0.00010, pe=12, pb=1.2, roe=0.08, debt_equity=0.6, revenue_cr=229000, qoq=-0.04, yoy=-0.08),
    _i("JSWSTEEL", "JSW Steel", "india", "Metals", "metals", "Commodities / Raw Materials", 920, 0.021, 0.00014, pe=18, pb=2.8, roe=0.12, debt_equity=0.9, revenue_cr=175000, qoq=0.01, yoy=0.03),
    _i("HINDALCO", "Hindalco", "india", "Metals", "metals", "Commodities / Raw Materials", 680, 0.022, 0.00016, pe=13, pb=1.4, roe=0.11, debt_equity=0.5, revenue_cr=216000, qoq=0.02, yoy=0.05),
    _i("VEDL", "Vedanta", "india", "Metals", "metals", "Commodities / Raw Materials", 448, 0.026, 0.00012, pe=11, pb=2.3, roe=0.21, debt_equity=1.1, revenue_cr=143000, qoq=-0.02, yoy=0.01),
    _i("ADANIENT", "Adani Enterprises", "india", "Conglomerate", "infra", "Real Estate / Infra", 2980, 0.028, 0.00020, pe=82, pb=8.4, roe=0.10, debt_equity=1.8, revenue_cr=96400, qoq=0.03, yoy=0.12),
    _i("ADANIPORTS", "Adani Ports", "india", "Infra", "infra", "Real Estate / Infra", 1420, 0.020, 0.00024, pe=28, pb=5.1, roe=0.18, debt_equity=1.0, revenue_cr=26700, qoq=0.04, yoy=0.14),
    _i("DLF", "DLF", "india", "Realty", "realty", "Real Estate / Infra", 820, 0.024, 0.00022, pe=62, pb=4.6, roe=0.07, debt_equity=0.2, revenue_cr=6400, qoq=0.06, yoy=0.20),
    _i("GODREJPROP", "Godrej Properties", "india", "Realty", "realty", "Real Estate / Infra", 2780, 0.025, 0.00020, pe=98, pb=6.8, roe=0.06, debt_equity=0.55, revenue_cr=4200, qoq=0.05, yoy=0.18),
    _i("IRCTC", "IRCTC", "india", "Services", "govtech", "GovTech / Professional Services", 820, 0.020, 0.00018, pe=52, pb=16, roe=0.38, debt_equity=0.01, revenue_cr=4300, qoq=0.03, yoy=0.10),
    _i("ZOMATO", "Zomato", "india", "Consumer Internet", "internet", "IT / MNC / Startups / Consulting", 248, 0.028, 0.00035, pe=280, pb=8.2, roe=0.03, debt_equity=0.02, revenue_cr=12100, qoq=0.12, yoy=0.55),
    _i("NYKAA", "Nykaa", "india", "Consumer Internet", "internet", "FMCG / Retail / Supply Chain", 186, 0.026, 0.00016, pe=980, pb=12, roe=0.04, debt_equity=0.08, revenue_cr=6400, qoq=0.06, yoy=0.22),
    _i("HAL", "Hindustan Aeronautics", "india", "Defence", "aero", "Manufacturing / Auto / Aero / Semiconductor", 4480, 0.022, 0.00036, pe=34, pb=9.5, roe=0.27, debt_equity=0.01, revenue_cr=30400, qoq=0.05, yoy=0.18),
    _i("BEL", "Bharat Electronics", "india", "Defence", "aero", "Manufacturing / Auto / Aero / Semiconductor", 298, 0.021, 0.00034, pe=42, pb=11, roe=0.26, debt_equity=0.02, revenue_cr=20200, qoq=0.06, yoy=0.21),
    _i("BHEL", "BHEL", "india", "Capital Goods", "capital-goods", "Manufacturing / Auto / Aero / Semiconductor", 248, 0.026, 0.00010, pe=68, pb=3.2, roe=0.04, debt_equity=0.25, revenue_cr=23800, qoq=0.02, yoy=0.06),
    _i("SIEMENS", "Siemens India", "india", "Capital Goods", "capital-goods", "Manufacturing / Auto / Aero / Semiconductor", 6820, 0.018, 0.00026, pe=78, pb=14, roe=0.18, debt_equity=0.04, revenue_cr=19800, qoq=0.04, yoy=0.13),
    _i("TATAELXSI", "Tata Elxsi", "india", "IT", "IT-mid", "IT / MNC / Startups / Consulting", 6780, 0.022, 0.00012, pe=48, pb=13, roe=0.32, debt_equity=0.02, revenue_cr=3600, qoq=0.01, yoy=0.04),
    _i("POLYCAB", "Polycab", "india", "Manufacturing", "electricals", "Manufacturing / Auto / Aero / Semiconductor", 6680, 0.020, 0.00028, pe=52, pb=11, roe=0.21, debt_equity=0.08, revenue_cr=18000, qoq=0.04, yoy=0.15),
    _i("INDIGO", "InterGlobe Aviation", "india", "Aviation", "aviation", "Manufacturing / Auto / Aero / Semiconductor", 4480, 0.024, 0.00030, pe=22, pb=18, roe=0.48, debt_equity=2.4, revenue_cr=71000, qoq=0.05, yoy=0.16),
    # —— US equity (INR equivalent) ——
    _i("AAPL", "Apple", "us", "Tech", "IT-large", "IT / MNC / Startups / Consulting", 18800, 0.015, 0.00028, pe=32, pb=48, roe=1.47, debt_equity=1.5, revenue_cr=3200000, qoq=0.02, yoy=0.06),
    _i("MSFT", "Microsoft", "us", "Tech", "IT-large", "IT / MNC / Startups / Consulting", 34800, 0.014, 0.00032, pe=36, pb=12, roe=0.36, debt_equity=0.3, revenue_cr=2030000, qoq=0.04, yoy=0.15),
    _i("GOOGL", "Alphabet", "us", "Tech", "IT-large", "IT / MNC / Startups / Consulting", 14200, 0.016, 0.00030, pe=24, pb=6.8, roe=0.30, debt_equity=0.1, revenue_cr=2800000, qoq=0.035, yoy=0.13),
    _i("AMZN", "Amazon", "us", "Consumer", "internet", "FMCG / Retail / Supply Chain", 15800, 0.018, 0.00028, pe=42, pb=8.2, roe=0.20, debt_equity=0.5, revenue_cr=4800000, qoq=0.03, yoy=0.11),
    _i("NVDA", "NVIDIA", "us", "Tech", "semiconductor", "Manufacturing / Auto / Aero / Semiconductor", 98000, 0.028, 0.00055, pe=58, pb=48, roe=1.15, debt_equity=0.2, revenue_cr=1000000, qoq=0.18, yoy=1.22),
    _i("META", "Meta Platforms", "us", "Tech", "internet", "Entertainment / Media / Gaming", 42800, 0.020, 0.00034, pe=26, pb=8.5, roe=0.32, debt_equity=0.18, revenue_cr=1340000, qoq=0.06, yoy=0.22),
    _i("TSLA", "Tesla", "us", "Auto", "auto", "Manufacturing / Auto / Aero / Semiconductor", 20800, 0.032, 0.00020, pe=68, pb=14, roe=0.18, debt_equity=0.15, revenue_cr=800000, qoq=-0.02, yoy=0.02),
    _i("JPM", "JPMorgan Chase", "us", "BFSI", "private banks", "BFSI / Bond / Cryptocurrency", 17200, 0.015, 0.00024, pe=12, pb=1.8, roe=0.16, debt_equity=0.0, revenue_cr=1400000, qoq=0.03, yoy=0.10),
    _i("JNJ", "Johnson & Johnson", "us", "Healthcare", "pharma", "Healthcare / Pharma / Insurance", 13200, 0.012, 0.00014, pe=22, pb=5.4, roe=0.22, debt_equity=0.45, revenue_cr=720000, qoq=0.015, yoy=0.04),
    _i("UNH", "UnitedHealth", "us", "Healthcare", "insurance", "Healthcare / Pharma / Insurance", 44800, 0.014, 0.00018, pe=20, pb=5.1, roe=0.25, debt_equity=0.7, revenue_cr=3100000, qoq=0.02, yoy=0.08),
    _i("V", "Visa", "us", "BFSI", "payments", "BFSI / Bond / Cryptocurrency", 23200, 0.013, 0.00026, pe=30, pb=14, roe=0.48, debt_equity=0.5, revenue_cr=290000, qoq=0.03, yoy=0.10),
    _i("MA", "Mastercard", "us", "BFSI", "payments", "BFSI / Bond / Cryptocurrency", 37800, 0.014, 0.00026, pe=36, pb=58, roe=1.60, debt_equity=1.8, revenue_cr=220000, qoq=0.035, yoy=0.12),
    _i("HD", "Home Depot", "us", "Retail", "retail", "FMCG / Retail / Supply Chain", 29800, 0.014, 0.00016, pe=24, pb=180, roe=8.4, debt_equity=12, revenue_cr=1260000, qoq=0.01, yoy=0.03),
    _i("PG", "Procter & Gamble", "us", "FMCG", "FMCG", "FMCG / Retail / Supply Chain", 13800, 0.011, 0.00014, pe=26, pb=7.8, roe=0.32, debt_equity=0.6, revenue_cr=700000, qoq=0.01, yoy=0.03),
    _i("DIS", "Walt Disney", "us", "Media", "media", "Entertainment / Media / Gaming", 8200, 0.018, 0.00012, pe=32, pb=1.8, roe=0.06, debt_equity=0.45, revenue_cr=740000, qoq=0.02, yoy=0.05),
    _i("NFLX", "Netflix", "us", "Media", "media", "Entertainment / Media / Gaming", 54800, 0.020, 0.00030, pe=42, pb=14, roe=0.32, debt_equity=0.7, revenue_cr=320000, qoq=0.04, yoy=0.15),
    _i("AMD", "AMD", "us", "Tech", "semiconductor", "Manufacturing / Auto / Aero / Semiconductor", 12800, 0.026, 0.00028, pe=180, pb=4.6, roe=0.03, debt_equity=0.05, revenue_cr=190000, qoq=0.08, yoy=0.14),
    _i("INTC", "Intel", "us", "Tech", "semiconductor", "Manufacturing / Auto / Aero / Semiconductor", 2480, 0.024, -0.00005, pe=0, pb=1.1, roe=-0.04, debt_equity=0.5, revenue_cr=450000, qoq=-0.08, yoy=-0.12),
    _i("BA", "Boeing", "us", "Aero", "aero", "Manufacturing / Auto / Aero / Semiconductor", 14800, 0.024, 0.00008, pe=0, pb=-48, roe=-0.18, debt_equity=-8, revenue_cr=640000, qoq=0.02, yoy=0.04),
    _i("CAT", "Caterpillar", "us", "Industrials", "capital-goods", "Manufacturing / Auto / Aero / Semiconductor", 27800, 0.016, 0.00020, pe=16, pb=8.4, roe=0.52, debt_equity=1.9, revenue_cr=550000, qoq=0.01, yoy=0.03),
    _i("XOM", "Exxon Mobil", "us", "Energy", "energy-oil", "Power / Energy / Oil", 9800, 0.016, 0.00012, pe=14, pb=1.9, roe=0.14, debt_equity=0.2, revenue_cr=2800000, qoq=-0.04, yoy=-0.06),
    _i("CVX", "Chevron", "us", "Energy", "energy-oil", "Power / Energy / Oil", 12800, 0.015, 0.00010, pe=15, pb=1.7, roe=0.12, debt_equity=0.18, revenue_cr=1680000, qoq=-0.03, yoy=-0.05),
    _i("KO", "Coca-Cola", "us", "FMCG", "FMCG", "FMCG / Retail / Supply Chain", 5400, 0.010, 0.00014, pe=24, pb=10, roe=0.38, debt_equity=1.6, revenue_cr=380000, qoq=0.015, yoy=0.05),
    _i("PEP", "PepsiCo", "us", "FMCG", "FMCG", "FMCG / Retail / Supply Chain", 14200, 0.011, 0.00013, pe=22, pb=12, roe=0.50, debt_equity=2.1, revenue_cr=760000, qoq=0.01, yoy=0.03),
    _i("WMT", "Walmart", "us", "Retail", "retail", "FMCG / Retail / Supply Chain", 6200, 0.012, 0.00020, pe=32, pb=6.8, roe=0.21, debt_equity=0.7, revenue_cr=5400000, qoq=0.02, yoy=0.06),
    _i("COST", "Costco", "us", "Retail", "retail", "FMCG / Retail / Supply Chain", 72800, 0.013, 0.00024, pe=52, pb=16, roe=0.30, debt_equity=0.35, revenue_cr=2100000, qoq=0.03, yoy=0.08),
    _i("CRM", "Salesforce", "us", "Tech", "IT-large", "IT / MNC / Startups / Consulting", 21800, 0.018, 0.00022, pe=38, pb=4.2, roe=0.10, debt_equity=0.2, revenue_cr=310000, qoq=0.03, yoy=0.10),
    _i("ORCL", "Oracle", "us", "Tech", "IT-large", "IT / MNC / Startups / Consulting", 13800, 0.016, 0.00028, pe=34, pb=42, roe=1.20, debt_equity=8.4, revenue_cr=440000, qoq=0.04, yoy=0.09),
    _i("ADBE", "Adobe", "us", "Tech", "IT-large", "IT / MNC / Startups / Consulting", 42800, 0.018, 0.00016, pe=36, pb=14, roe=0.36, debt_equity=0.4, revenue_cr=180000, qoq=0.025, yoy=0.11),
    _i("PFE", "Pfizer", "us", "Pharma", "pharma", "Healthcare / Pharma / Insurance", 2480, 0.016, -0.00002, pe=18, pb=1.6, roe=0.09, debt_equity=0.7, revenue_cr=480000, qoq=-0.06, yoy=-0.18),
    _i("LLY", "Eli Lilly", "us", "Pharma", "pharma", "Healthcare / Pharma / Insurance", 72800, 0.018, 0.00040, pe=82, pb=52, roe=0.64, debt_equity=2.1, revenue_cr=380000, qoq=0.12, yoy=0.36),
    _i("AVGO", "Broadcom", "us", "Tech", "semiconductor", "Manufacturing / Auto / Aero / Semiconductor", 14200, 0.022, 0.00038, pe=48, pb=18, roe=0.42, debt_equity=1.2, revenue_cr=430000, qoq=0.08, yoy=0.28),
    _i("GS", "Goldman Sachs", "us", "BFSI", "private banks", "BFSI / Bond / Cryptocurrency", 41800, 0.017, 0.00022, pe=14, pb=1.5, roe=0.12, debt_equity=0.0, revenue_cr=420000, qoq=0.04, yoy=0.12),
    _i("BAC", "Bank of America", "us", "BFSI", "private banks", "BFSI / Bond / Cryptocurrency", 3280, 0.016, 0.00018, pe=12, pb=1.1, roe=0.10, debt_equity=0.0, revenue_cr=820000, qoq=0.02, yoy=0.06),
    _i("QCOM", "Qualcomm", "us", "Tech", "semiconductor", "Manufacturing / Auto / Aero / Semiconductor", 14200, 0.020, 0.00024, pe=18, pb=7.2, roe=0.38, debt_equity=0.6, revenue_cr=320000, qoq=0.03, yoy=0.08),
    _i("NKE", "Nike", "us", "Consumer", "retail", "FMCG / Retail / Supply Chain", 6800, 0.018, 0.00008, pe=26, pb=9.4, roe=0.36, debt_equity=0.9, revenue_cr=430000, qoq=-0.01, yoy=-0.03),
    _i("ABBV", "AbbVie", "us", "Pharma", "pharma", "Healthcare / Pharma / Insurance", 15800, 0.013, 0.00020, pe=16, pb=42, roe=0.55, debt_equity=4.2, revenue_cr=450000, qoq=0.02, yoy=0.05),
    # —— Commodities ——
    _i("GOLD", "Gold (MCX)", "commodities", "Precious", "precious", "Commodities / Raw Materials", 72400, 0.010, 0.00012, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("SILVER", "Silver (MCX)", "commodities", "Precious", "precious", "Commodities / Raw Materials", 84200, 0.018, 0.00010, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("CRUDE", "Crude Oil WTI", "commodities", "Energy", "energy-oil", "Power / Energy / Oil", 6800, 0.022, 0.00004, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("BRENT", "Brent Crude", "commodities", "Energy", "energy-oil", "Power / Energy / Oil", 7120, 0.020, 0.00005, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("COPPER", "Copper", "commodities", "Industrial", "metals", "Commodities / Raw Materials", 780, 0.016, 0.00008, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("NATGAS", "Natural Gas", "commodities", "Energy", "energy-oil", "Power / Energy / Oil", 248, 0.035, 0.00002, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("WHEAT", "Wheat", "commodities", "Agri", "agri", "Commodities / Raw Materials", 218, 0.018, 0.00004, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("CORN", "Corn", "commodities", "Agri", "agri", "Commodities / Raw Materials", 168, 0.016, 0.00003, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("ALUMINIUM", "Aluminium", "commodities", "Industrial", "metals", "Commodities / Raw Materials", 228, 0.015, 0.00005, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("NICKEL", "Nickel", "commodities", "Industrial", "metals", "Commodities / Raw Materials", 1480, 0.024, 0.00004, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("ZINC", "Zinc", "commodities", "Industrial", "metals", "Commodities / Raw Materials", 268, 0.017, 0.00005, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("PALLADIUM", "Palladium", "commodities", "Precious", "precious", "Commodities / Raw Materials", 84200, 0.022, 0.00002, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("PLATINUM", "Platinum", "commodities", "Precious", "precious", "Commodities / Raw Materials", 81200, 0.016, 0.00006, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("COTTON", "Cotton", "commodities", "Agri", "agri", "Commodities / Raw Materials", 58200, 0.015, 0.00003, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("SUGAR", "Sugar", "commodities", "Agri", "agri", "Commodities / Raw Materials", 42, 0.014, 0.00004, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    # —— Bonds (yield instruments) ——
    _i("IN10Y", "India G-Sec 10Y", "bonds", "Sovereign", "gsec", "BFSI / Bond / Cryptocurrency", 100.0, 0.0035, 0.00002, bond_yield=0.069, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("IN5Y", "India G-Sec 5Y", "bonds", "Sovereign", "gsec", "BFSI / Bond / Cryptocurrency", 100.2, 0.0028, 0.00002, bond_yield=0.066, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("IN2Y", "India G-Sec 2Y", "bonds", "Sovereign", "gsec", "BFSI / Bond / Cryptocurrency", 100.1, 0.0020, 0.000015, bond_yield=0.064, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("UST10Y", "US Treasury 10Y", "bonds", "Sovereign", "ust", "BFSI / Bond / Cryptocurrency", 98.4, 0.0040, 0.00001, bond_yield=0.042, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("UST2Y", "US Treasury 2Y", "bonds", "Sovereign", "ust", "BFSI / Bond / Cryptocurrency", 99.6, 0.0024, 0.00001, bond_yield=0.041, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("UST30Y", "US Treasury 30Y", "bonds", "Sovereign", "ust", "BFSI / Bond / Cryptocurrency", 96.8, 0.0055, 0.000005, bond_yield=0.045, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("INCORPAAA", "India Corp AAA", "bonds", "Credit", "corp-aaa", "BFSI / Bond / Cryptocurrency", 101.2, 0.0045, 0.000025, bond_yield=0.076, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("INCORPAA", "India Corp AA", "bonds", "Credit", "corp-aa", "BFSI / Bond / Cryptocurrency", 99.4, 0.0055, 0.00002, bond_yield=0.082, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("SDL", "State Development Loans", "bonds", "Sovereign", "sdl", "BFSI / Bond / Cryptocurrency", 100.5, 0.0038, 0.00002, bond_yield=0.072, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("SGB", "Sovereign Gold Bond", "bonds", "Sovereign", "sgb", "BFSI / Bond / Cryptocurrency", 7240, 0.009, 0.00010, bond_yield=0.025, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("INFLBOND", "Inflation Indexed Bond", "bonds", "Sovereign", "iib", "BFSI / Bond / Cryptocurrency", 102.1, 0.0030, 0.000018, bond_yield=0.055, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("TIPS", "US TIPS 10Y", "bonds", "Sovereign", "tips", "BFSI / Bond / Cryptocurrency", 97.8, 0.0036, 0.00001, bond_yield=0.018, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    # —— Crypto ——
    _i("BTC", "Bitcoin", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 5_400_000, 0.028, 0.00040, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("ETH", "Ethereum", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 268_000, 0.032, 0.00035, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("SOL", "Solana", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 14_800, 0.045, 0.00045, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("BNB", "BNB", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 48_200, 0.030, 0.00028, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("XRP", "XRP", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 52, 0.040, 0.00022, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("ADA", "Cardano", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 38, 0.038, 0.00018, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("AVAX", "Avalanche", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 2_840, 0.042, 0.00025, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("DOT", "Polkadot", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 580, 0.040, 0.00016, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("MATIC", "Polygon", "crypto", "Crypto", "crypto-L2", "BFSI / Bond / Cryptocurrency", 48, 0.042, 0.00014, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("LINK", "Chainlink", "crypto", "Crypto", "crypto-oracle", "BFSI / Bond / Cryptocurrency", 1_180, 0.036, 0.00026, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("UNI", "Uniswap", "crypto", "Crypto", "crypto-defi", "BFSI / Bond / Cryptocurrency", 820, 0.040, 0.00022, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("ATOM", "Cosmos", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 680, 0.038, 0.00012, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("LTC", "Litecoin", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 7_240, 0.032, 0.00010, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("NEAR", "NEAR Protocol", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 480, 0.044, 0.00020, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("APT", "Aptos", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 720, 0.046, 0.00024, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("SUI", "Sui", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 164, 0.048, 0.00030, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("TON", "Toncoin", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 520, 0.040, 0.00022, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("DOGE", "Dogecoin", "crypto", "Crypto", "crypto-meme", "Entertainment / Media / Gaming", 12.4, 0.050, 0.00015, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("ARB", "Arbitrum", "crypto", "Crypto", "crypto-L2", "BFSI / Bond / Cryptocurrency", 68, 0.044, 0.00018, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("OP", "Optimism", "crypto", "Crypto", "crypto-L2", "BFSI / Bond / Cryptocurrency", 148, 0.044, 0.00016, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("FIL", "Filecoin", "crypto", "Crypto", "crypto-storage", "IT / MNC / Startups / Consulting", 420, 0.042, 0.00010, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("AAVE", "Aave", "crypto", "Crypto", "crypto-defi", "BFSI / Bond / Cryptocurrency", 12_400, 0.038, 0.00022, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("MKR", "Maker", "crypto", "Crypto", "crypto-defi", "BFSI / Bond / Cryptocurrency", 148_000, 0.036, 0.00014, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("INJ", "Injective", "crypto", "Crypto", "crypto-L1", "BFSI / Bond / Cryptocurrency", 1_980, 0.046, 0.00026, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
    _i("RENDER", "Render", "crypto", "Crypto", "crypto-ai", "IT / MNC / Startups / Consulting", 620, 0.048, 0.00028, pe=0, pb=0, roe=0, debt_equity=0, revenue_cr=0, qoq=0, yoy=0),
]


def by_ticker() -> Dict[str, Instrument]:
    return {i.ticker: i for i in UNIVERSE}
