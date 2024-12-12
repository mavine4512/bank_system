import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const CustomerDependants = () => {
  const { customerId } = useParams();
  const [dependants, setDependants] = useState([]);
  const [newDependant, setNewDependant] = useState({
    full_name: '',
    relationship: '',
    date_of_birth: '',
  });
  const [editDependantId, setEditDependantId] = useState(null);
  const [editingDependant, setEditingDependant] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (customerId) {
      fetchDependants();
    }
  }, [customerId]);

  const fetchDependants = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/customers/${customerId}/dependants`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setDependants(data);
      } else {
        console.error('Invalid response format:', data);
      }
    } catch (error) {
      console.error('Error fetching dependants:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDependant((prev) => ({ ...prev, [name]: value }));
  };

  const handleRelationshipChange = (value) => {
    setNewDependant((prev) => ({ ...prev, relationship: value }));
  };


const handleAddDependant = async () => {
  if (!newDependant.full_name || !newDependant.relationship || !newDependant.date_of_birth) {
    console.warn('All fields are required to add a dependant');
    return;
  }

  const formattedDateOfBirth = new Date(newDependant.date_of_birth).toISOString().split('T')[0];
  const payload = { ...newDependant, date_of_birth: formattedDateOfBirth };

  try {
    const response = await fetch(`http://localhost:3000/api/create/customers/${customerId}/dependants`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    window.location.reload();

    const addedDependant = await response.json();
    setDependants((prev) => [...prev, addedDependant]);
    setNewDependant({ full_name: '', relationship: '', date_of_birth: '' });
  } catch (error) {
    console.error('Error adding dependant:', error);
  }
};

  const handleEditDependant = (dependant) => {
    setEditDependantId(dependant.dependant_id);
    setEditingDependant(dependant);
  };

  const handleUpdateDependant = async () => {
    if (editingDependant.full_name && editingDependant.relationship && editingDependant.date_of_birth) {
      try {
        const response = await fetch(`http://localhost:3000/api/edit/customers/${customerId}/dependants/${editDependantId}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingDependant),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        window.location.reload();

        const updatedDependant = await response.json();
        setDependants((prev) =>
          prev.map((dep) => (dep.dependant_id === editDependantId ? updatedDependant : dep))
        );
        setEditDependantId(null);
        setEditingDependant(null);
      } catch (error) {
        console.error('Error updating dependant:', error);
      }
    }
  };

  const handleDeleteDependant = async (dependantId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/delete/customers/${customerId}/dependants/${dependantId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setDependants((prev) => prev.filter((dep) => dep.dependant_id !== dependantId));
    } catch (error) {
      console.error('Error deleting dependant:', error);
    }
  };

  const handleEditingInputChange = (e) => {
    const { name, value } = e.target;
    setEditingDependant((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Dependants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={newDependant.full_name}
                onChange={handleInputChange}
                placeholder="Dependant's full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="relationship">Relationship</Label>
              <Select onValueChange={handleRelationshipChange} value={newDependant.relationship}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={newDependant.date_of_birth}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleAddDependant}>
            Add Dependant
          </Button>
        </div>

        {dependants.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Existing Dependants</h3>
            <ul className="space-y-2">
              {dependants.map((dependant) => (
                <li key={dependant.dependant_id} className="bg-gray-100 p-2 rounded flex justify-between items-center">
                  {editDependantId === dependant.dependant_id ? (
                    <div className="flex space-x-2">
                      <Input
                        name="full_name"
                        value={editingDependant.full_name}
                        onChange={handleEditingInputChange}
                        placeholder="Full Name"
                      />
                      <Select
                        onValueChange={(value) =>
                          setEditingDependant((prev) => ({ ...prev, relationship: value }))
                        }
                        value={editingDependant.relationship}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Relationship" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="Child">Child</SelectItem>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        name="date_of_birth"
                        type="date"
                        value={editingDependant.date_of_birth}
                        onChange={handleEditingInputChange}
                      />
                      <Button variant="secondary" size="sm" onClick={handleUpdateDependant}>
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditDependantId(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span>
                        {dependant.full_name} - {dependant.relationship} (DoB: {new Date(dependant.date_of_birth).toLocaleDateString()})
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="secondary" size="sm" onClick={() => handleEditDependant(dependant)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteDependant(dependant.dependant_id)}>
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerDependants;
