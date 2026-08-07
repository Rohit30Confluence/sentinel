import dragon_fight

def test_smoke_import_and_simulate():
    # smoke test: ensure module imports and simulate_runs is callable
    assert hasattr(dragon_fight, 'simulate_runs')
    res = dragon_fight.simulate_runs(1)
    assert isinstance(res, dict)
