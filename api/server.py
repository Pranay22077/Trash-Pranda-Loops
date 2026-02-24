"""
Flask API server for Trash Panda Loops
Connects the React frontend to the Python game logic
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

# Add parent directory to path to import game modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from game import Game, GameState

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Store active game sessions (in production, use Redis or database)
game_sessions = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Trash Panda Loops API is running"})

@app.route('/api/game/start', methods=['POST'])
def start_game():
    """Start a new game session"""
    try:
        game = Game()
        result = game.start_game()
        
        # Store game session
        session_id = result['run_id']
        game_sessions[session_id] = game
        
        return jsonify({
            "success": True,
            "session_id": session_id,
            "state": game.get_game_state()
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/game/<int:session_id>/state', methods=['GET'])
def get_game_state(session_id):
    """Get current game state"""
    game = game_sessions.get(session_id)
    
    if not game:
        return jsonify({"success": False, "error": "Session not found"}), 404
    
    return jsonify({
        "success": True,
        "state": game.get_game_state()
    })

@app.route('/api/game/<int:session_id>/action', methods=['POST'])
def game_action(session_id):
    """Process player action"""
    game = game_sessions.get(session_id)
    
    if not game:
        return jsonify({"success": False, "error": "Session not found"}), 404
    
    try:
        data = request.json
        action_data = data.get('action', {})
        dt = data.get('dt', 0.016)  # Default to 60 FPS
        
        # Map frontend action to backend format
        action_type = action_data.get('type')
        backend_action = None
        
        if action_type == 'move':
            # Map direction to actual movement
            direction = action_data.get('direction', [0, 0])
            backend_action = {'type': 'move', 'direction': direction}
        elif action_type == 'hide':
            backend_action = {'type': 'hide'}
        elif action_type == 'interact':
            backend_action = {'type': 'interact'}
        elif action_type == 'use_ability':
            backend_action = {'type': 'use_ability', 'ability_id': action_data.get('ability_id')}
        
        result = game.update(dt, backend_action)
        
        return jsonify({
            "success": True,
            "result": result,
            "state": game.get_game_state()
        })
    except Exception as e:
        print(f"Error processing action: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/game/<int:session_id>/unlock', methods=['POST'])
def unlock_ability(session_id):
    """Unlock an ability"""
    game = game_sessions.get(session_id)
    
    if not game:
        return jsonify({"success": False, "error": "Session not found"}), 404
    
    try:
        data = request.json
        ability_id = data.get('ability_id')
        
        result = game.unlock_ability(ability_id)
        
        return jsonify({
            "success": True,
            "result": result,
            "progression": game.progression.get_state()
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """Get global leaderboard (mock data for now)"""
    # In production, this would query a database
    leaderboard = [
        {"rank": 1, "player": "TrashMaster", "score": 2450, "snacks": 12, "time": "45.2s"},
        {"rank": 2, "player": "SneakyPanda", "score": 2380, "snacks": 11, "time": "47.8s"},
        {"rank": 3, "player": "NightRaider", "score": 2290, "snacks": 10, "time": "48.5s"},
        {"rank": 4, "player": "StealthyBoi", "score": 2150, "snacks": 10, "time": "50.1s"},
        {"rank": 5, "player": "SnackThief", "score": 2080, "snacks": 9, "time": "51.3s"},
        {"rank": 6, "player": "MidnightHeist", "score": 1950, "snacks": 9, "time": "52.7s"},
        {"rank": 7, "player": "ShadowPaws", "score": 1890, "snacks": 8, "time": "53.2s"},
        {"rank": 8, "player": "QuietBandit", "score": 1820, "snacks": 8, "time": "54.0s"},
        {"rank": 9, "player": "GhostRaccoon", "score": 1750, "snacks": 7, "time": "54.8s"},
        {"rank": 10, "player": "NinjaTrash", "score": 1680, "snacks": 7, "time": "55.5s"},
    ]
    
    return jsonify({
        "success": True,
        "leaderboard": leaderboard
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get player stats (mock data for now)"""
    # In production, this would query user's stats from database
    stats = {
        "total_loops": 127,
        "snacks_collected": 1234,
        "best_score": 2450,
        "abilities_unlocked": 3,
        "total_abilities": 5,
        "achievements": [
            {"id": "first_heist", "name": "First Heist", "unlocked": True},
            {"id": "speed_demon", "name": "Speed Demon", "unlocked": True},
            {"id": "ghost", "name": "Ghost", "unlocked": False},
            {"id": "collector", "name": "Collector", "unlocked": True},
            {"id": "veteran", "name": "Veteran", "unlocked": False},
            {"id": "legendary", "name": "Legendary Thief", "unlocked": False},
        ]
    }
    
    return jsonify({
        "success": True,
        "stats": stats
    })

if __name__ == '__main__':
    print("🦝 Starting Trash Panda Loops API Server...")
    print("📡 API will be available at http://localhost:5000")
    print("🎮 Frontend should connect to this server")
    app.run(debug=True, host='0.0.0.0', port=5000)
