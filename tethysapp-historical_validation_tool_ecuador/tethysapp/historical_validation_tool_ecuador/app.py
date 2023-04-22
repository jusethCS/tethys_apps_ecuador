from tethys_sdk.base import TethysAppBase


class HistoricalValidationToolEcuador(TethysAppBase):
    """
    Tethys app class for Historical Validation Tool Ecuador.
    """

    name = 'Historical Validation Tool Ecuador'
    description = 'This app combines the observed data and the simulated data from the GEOGloWS ECMWF Streaamflow Services in Ecuador.'
    package = 'historical_validation_tool_ecuador'  # WARNING: Do not change this value
    index = 'home'
    icon = f'{package}/images/icon.gif'
    root_url = 'historical-validation-tool-ecuador'
    color = '#4074dd'
    tags = '"Hydrology", "Time Series", "Bias Correction", "Hydrostats", "GEOGloWS", "Historical Validation Tool", "Ecuador"'
    enable_feedback = False
    feedback_emails = []