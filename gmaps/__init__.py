VERSION = (0, 13)
__version__ = '.'.join(map(str, VERSION))
DATE = "2014-10-30"
try:
    from . import conf
except ImportError:
    pass
