VERSION = (0, 7)
__version__ = '.'.join(map(str, VERSION))
DATE = "2014-06-03"
try:
    from . import conf
except:
    pass